// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ShoppingBag,
	Package,
	Clock,
	CheckCircle2,
	Truck,
	Star,
	Wallet,
	Calendar,
	CreditCard,
	XCircle,
	Heart,
	UserCircle,
	X,
	AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { translateNumber } from "@/utils/translateNumber";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";
import { getMyOrders } from "@/services/orderService";
import { getWalletBalance } from "@/services/walletService";
import { getMyProfile } from "@/services/userService";
import { getWishlist } from "@/services/wishlistService";

interface Order {
	id: number;
	status: number;
	totalAmount: number;
	createdAt: string;
	items: { id: number; count: number; product: { name: string; productPic: string } }[];
}

const STATUS_MAP: Record<number, { label: string; variant: "available" | "new" | "outOfStock" | "secondary"; icon: React.ElementType }> = {
	1: { label: "در انتظار پرداخت", variant: "outOfStock", icon: Clock },
	2: { label: "پرداخت شده", variant: "new", icon: CreditCard },
	3: { label: "ارسال شده", variant: "new", icon: Truck },
	4: { label: "تحویل داده شده", variant: "available", icon: CheckCircle2 },
	5: { label: "لغو شده", variant: "secondary", icon: XCircle },
};

interface Profile {
	firstName: string;
	lastName: string;
	email: string;
}

export default function DashboardPage() {
	const [recentOrders, setRecentOrders] = useState<Order[]>([]);
	const [ordersLoading, setOrdersLoading] = useState(true);
	const [walletBalance, setWalletBalance] = useState<number | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [bannerDismissed, setBannerDismissed] = useState(false);
	const [wishlistCount, setWishlistCount] = useState<number | null>(null);

	useEffect(() => {
		getMyOrders()
			.then((res) => setRecentOrders((res?.data ?? []).slice(0, 3)))
			.catch(() => setRecentOrders([]))
			.finally(() => setOrdersLoading(false));
		getWalletBalance()
			.then((res) => setWalletBalance(res?.data?.balance ?? 0))
			.catch(() => setWalletBalance(0));
		getMyProfile()
			.then((res) => setProfile(res?.data ?? null))
			.catch(() => {});
		getWishlist()
			.then((res) => setWishlistCount((res?.data ?? []).length))
			.catch(() => setWishlistCount(0));
	}, []);

	const missingFields: string[] = [];
	if (profile && !profile.firstName) missingFields.push("نام");
	if (profile && !profile.lastName) missingFields.push("نام خانوادگی");
	if (profile && !profile.email) missingFields.push("ایمیل");
	const showBanner = profile !== null && missingFields.length > 0 && !bannerDismissed;

	return (
		<div className="space-y-6">
			{/* Profile completion banner */}
			<AnimatePresence>
				{showBanner && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.3 }}
					>
						<Card className="border-amber-400/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 overflow-hidden">
							<CardContent className="p-4">
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
										<AlertCircle className="w-5 h-5 text-amber-600" />
									</div>
									<div className="flex-1">
										<p className="font-semibold text-sm mb-1">پروفایل شما ناقص است</p>
										<p className="text-xs text-muted-foreground mb-3">
											لطفا اطلاعات زیر را تکمیل کنید:{" "}
											<span className="font-medium text-foreground">{missingFields.join("، ")}</span>
										</p>
										<Link href="/dashboard/settings">
											<Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white h-8 gap-2">
												<UserCircle className="w-4 h-4" />
												تکمیل اطلاعات
											</Button>
										</Link>
									</div>
									<button
										onClick={() => setBannerDismissed(true)}
										className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
									>
										<X className="w-4 h-4" />
									</button>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Welcome Section */}
			{/* <motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<h1 className="text-3xl font-bold gradient-text mb-2">
					خوش آمدید! 👋
				</h1>
				<p className="text-muted-foreground">
					خلاصه‌ای از فعالیت‌های شما در ماهورا
				</p>
			</motion.div> */}

			{/* Stats Grid */}
			{/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Card className="hover:shadow-lg transition-shadow">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
									<ShoppingBag className="w-6 h-6 text-blue-600" />
								</div>
								<TrendingUp className="w-5 h-5 text-green-600" />
							</div>
							<p className="text-2xl font-bold gradient-text mb-1">
								{new Intl.NumberFormat("fa-IR").format(
									MOCK_STATS.totalOrders,
								)}
							</p>
							<p className="text-sm text-muted-foreground">
								کل سفارش‌ها
							</p>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card className="hover:shadow-lg transition-shadow">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
									<Package className="w-6 h-6 text-green-600" />
								</div>
							</div>
							<p className="text-2xl font-bold gradient-text mb-1">
								{new Intl.NumberFormat("fa-IR").format(
									MOCK_STATS.completedOrders,
								)}
							</p>
							<p className="text-sm text-muted-foreground">
								سفارش‌های کامل
							</p>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Card className="hover:shadow-lg transition-shadow">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
									<Heart className="w-6 h-6 text-red-600" />
								</div>
							</div>
							<p className="text-2xl font-bold gradient-text mb-1">
								{new Intl.NumberFormat("fa-IR").format(
									MOCK_STATS.wishlistItems,
								)}
							</p>
							<p className="text-sm text-muted-foreground">
								علاقه‌مندی
							</p>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Card className="hover:shadow-lg transition-shadow">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
									<Gift className="w-6 h-6 text-amber-600" />
								</div>
							</div>
							<p className="text-2xl font-bold gradient-text mb-1">
								{new Intl.NumberFormat("fa-IR").format(
									MOCK_STATS.loyaltyPoints,
								)}
							</p>
							<p className="text-sm text-muted-foreground">
								امتیاز پاداش
							</p>
						</CardContent>
					</Card>
				</motion.div>
			</div> */}

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className="grid md:grid-cols-3 gap-4"
			>
				<Link href="/dashboard/wallet">
					<Card className="hover:shadow-lg transition-all hover:border-primary-rose cursor-pointer">
						<CardContent className="p-6 text-center">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-rose/20 to-accent-gold/20 flex items-center justify-center">
								<Wallet className="w-8 h-8 text-primary-rose" />
							</div>
							<h3 className="font-bold mb-2">کیف پول</h3>
							{walletBalance === null ? (
								<Skeleton className="h-4 w-28 mx-auto mt-1" />
							) : (
								<p className="text-sm text-muted-foreground">
									موجودی {formatPrice(walletBalance)} ریال
								</p>
							)}
						</CardContent>
					</Card>
				</Link>

				<Link href="/dashboard/wishlist">
					<Card className="hover:shadow-lg transition-all hover:border-primary-rose cursor-pointer">
						<CardContent className="p-6 text-center">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
								<Heart className="w-8 h-8 text-red-600" />
							</div>
							<h3 className="font-bold mb-2">علاقه‌مندی‌ها</h3>
							{wishlistCount === null ? (
								<Skeleton className="h-4 w-24 mx-auto mt-1" />
							) : (
								<p className="text-sm text-muted-foreground">
									{new Intl.NumberFormat("fa-IR").format(wishlistCount)} محصول ذخیره شده
								</p>
							)}
						</CardContent>
					</Card>
				</Link>

				<div>
					<Card className="hover:shadow-lg transition-all hover:border-primary-rose cursor-pointer">
						<CardContent className="p-6 text-center">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
								<Calendar className="w-8 h-8 text-amber-600" />
							</div>
							<h3 className="font-bold mb-2">تاریخ عضویت</h3>
							<p className="text-sm text-muted-foreground">
                                {translateNumber("1404/1/27")}
							</p>
						</CardContent>
					</Card>
				</div>
			</motion.div>

			{/* Recent Orders */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
			>
				<Card>
					<div className="bg-gradient-to-r from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-bold flex items-center gap-2">
								<Package className="w-5 h-5" />
								آخرین سفارش‌ها
							</h2>
							<Link href="/dashboard/orders">
								<Button variant="ghost" size="sm">
									مشاهده همه
								</Button>
							</Link>
						</div>
					</div>

					<CardContent className="p-0">
						<div className="divide-y">
							{ordersLoading ? (
								Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className="p-4">
										<div className="flex items-center gap-4">
											<Skeleton className="w-16 h-16 flex-shrink-0 rounded-lg" />
											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-2">
													<Skeleton className="h-4 w-28" />
													<Skeleton className="h-5 w-20 rounded-full" />
												</div>
												<Skeleton className="h-3 w-44" />
												<Skeleton className="h-5 w-24" />
											</div>
											<Skeleton className="h-8 w-16 rounded-md" />
										</div>
									</div>
								))
							) : recentOrders.length === 0 ? (
								<div className="p-8 text-center text-muted-foreground text-sm">
									هنوز سفارشی ندارید
								</div>
							) : (
								recentOrders.map((order) => {
									const s = STATUS_MAP[order.status] ?? STATUS_MAP[1];
									const StatusIcon = s.icon;
									const firstItem = order.items?.[0];
									const itemCount = order.items?.reduce((sum, i) => sum + i.count, 0) ?? 0;
									return (
										<div
											key={order.id}
											className="p-4 hover:bg-muted/50 transition-colors"
										>
											<div className="flex items-center gap-4">
												<div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 flex items-center justify-center">
													{firstItem?.product?.productPic ? (
														<img src={firstItem.product.productPic} alt={firstItem.product.name} className="w-full h-full object-cover" />
													) : (
														<Package className="w-8 h-8 text-muted-foreground" />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<p className="font-semibold">
															سفارش #{new Intl.NumberFormat("fa-IR").format(order.id)}
														</p>
														<Badge variant={s.variant} className="text-xs">{s.label}</Badge>
													</div>
													<p className="text-sm text-muted-foreground mb-1">
														{formatDate(order.createdAt)} •{" "}
														{new Intl.NumberFormat("fa-IR").format(itemCount)} محصول
													</p>
													<p className="text-lg font-bold gradient-text">
														{formatPrice(order.totalAmount)} ریال
													</p>
												</div>
												<div className="flex items-center gap-3">
													<StatusIcon className="w-5 h-5 text-muted-foreground" />
													<Link href={`/dashboard/orders/${order.id}`}>
														<Button variant="outline" size="sm">جزئیات</Button>
													</Link>
												</div>
											</div>
										</div>
									);
								})
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}

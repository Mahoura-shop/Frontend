"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Package,
	Clock,
	Truck,
	CreditCard,
	XCircle,
	UserCircle,
	X,
	AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
	5: { label: "لغو شده", variant: "secondary", icon: XCircle },
};

interface Profile {
	firstName: string;
	lastName: string;
	email: string;
	createdAt: string;
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
		<div className="space-y-6" dir="rtl">
			<AnimatePresence>
				{showBanner && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.3 }}
					>
						<Card className="border-amber-400/50 bg-amber-50/80 dark:bg-amber-900/20 overflow-hidden">
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

			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
			>
				<div className="bg-card border border-border rounded-xl overflow-hidden">
					<div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-border">
						<Link href="/dashboard/wallet" className="p-6 hover:bg-muted/40 transition-colors group" data-testid="wallet-card">
							<p className="text-xs text-muted-foreground mb-2 font-medium">موجودی کیف پول</p>
							{walletBalance === null ? (
								<Skeleton className="h-8 w-36 mb-2" />
							) : (
								<p className="text-3xl font-black text-foreground mb-2 tabular-nums">
									{new Intl.NumberFormat("fa-IR").format(walletBalance)}
									<span className="text-sm font-medium text-muted-foreground mr-1">ریال</span>
								</p>
							)}
							<span className="text-xs font-semibold text-primary-rose group-hover:underline">
								شارژ کیف پول
							</span>
						</Link>

						<Link href="/dashboard/wishlist" className="p-6 hover:bg-muted/40 transition-colors">
							<p className="text-xs text-muted-foreground mb-2 font-medium">علاقه‌مندی‌ها</p>
							{wishlistCount === null ? (
								<Skeleton className="h-8 w-16 mb-2" />
							) : (
								<p className="text-3xl font-black text-foreground mb-2 tabular-nums">
									{new Intl.NumberFormat("fa-IR").format(wishlistCount)}
									<span className="text-sm font-medium text-muted-foreground mr-1">محصول</span>
								</p>
							)}
							<span className="text-xs text-muted-foreground">ذخیره شده</span>
						</Link>

						<div className="p-6">
							<p className="text-xs text-muted-foreground mb-2 font-medium">تاریخ عضویت</p>
							{profile === null ? (
								<Skeleton className="h-8 w-28 mb-2" />
							) : (
								<p className="text-xl font-bold text-foreground mb-2">
									{formatDate(profile.createdAt)}
								</p>
							)}
							<span className="text-xs text-muted-foreground">عضو ماهورا</span>
						</div>
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
			>
				<Card data-testid="recent-orders">
					<div className="px-5 py-4 border-b flex items-center justify-between">
						<h2 className="text-base font-semibold flex items-center gap-2">
							<Package className="w-4 h-4 text-muted-foreground" />
							آخرین سفارش‌ها
						</h2>
						<Link href="/dashboard/orders">
							<Button variant="ghost" size="sm" className="text-xs">
								مشاهده همه
							</Button>
						</Link>
					</div>

					<CardContent className="p-0">
						<div className="divide-y">
							{ordersLoading ? (
								Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className="p-4">
										<div className="flex items-center gap-4">
											<Skeleton className="w-14 h-14 flex-shrink-0 rounded-lg" />
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
										<div key={order.id} className="p-4 hover:bg-muted/40 transition-colors">
											<div className="flex items-center gap-4">
												<div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
													{firstItem?.product?.productPic ? (
														<img src={firstItem.product.productPic} alt={firstItem.product.name} className="w-full h-full object-cover" />
													) : (
														<Package className="w-6 h-6 text-muted-foreground" />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<p className="font-semibold text-sm">
															سفارش #{new Intl.NumberFormat("fa-IR").format(order.id)}
														</p>
														<Badge variant={s.variant} className="text-xs">{s.label}</Badge>
													</div>
													<p className="text-xs text-muted-foreground mb-1">
														{formatDate(order.createdAt)} · {new Intl.NumberFormat("fa-IR").format(itemCount)} محصول
													</p>
													<p className="text-base font-bold text-primary-rose">
														{formatPrice(order.totalAmount)} ریال
													</p>
												</div>
												<div className="flex items-center gap-2">
													<StatusIcon className="w-4 h-4 text-muted-foreground" />
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

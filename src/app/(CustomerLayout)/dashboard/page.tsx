// src/app/dashboard/page.tsx
"use client";

import { motion } from "framer-motion";
import {
	ShoppingBag,
	Package,
	TrendingUp,
	Heart,
	Gift,
	Clock,
	CheckCircle2,
	Truck,
	Star,
    Wallet,
    Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { translateNumber } from "@/utils/translateNumber";

// Mock data
const MOCK_STATS = {
	totalOrders: 12,
	completedOrders: 10,
	pendingOrders: 2,
	totalSpent: 15420000,
	wishlistItems: 5,
	loyaltyPoints: 2500,
};

const MOCK_RECENT_ORDERS = [
	{
		id: 1234,
		date: "۱۴۰۳/۰۲/۲۵",
		status: "delivered",
		total: 890000,
		items: 2,
		image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=100&h=100&fit=crop",
	},
	{
		id: 1233,
		date: "۱۴۰۳/۰۲/۲۰",
		status: "shipping",
		total: 680000,
		items: 1,
		image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop",
	},
	{
		id: 1232,
		date: "۱۴۰۳/۰۲/۱۵",
		status: "processing",
		total: 1200000,
		items: 3,
		image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop",
	},
];

export default function DashboardPage() {
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("fa-IR").format(price);
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "delivered":
				return <Badge variant="available">تحویل داده شده</Badge>;
			case "shipping":
				return <Badge variant="new">در حال ارسال</Badge>;
			case "processing":
				return <Badge variant="outOfStock">در حال پردازش</Badge>;
			default:
				return <Badge>{status}</Badge>;
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "delivered":
				return <CheckCircle2 className="w-5 h-5 text-green-600" />;
			case "shipping":
				return <Truck className="w-5 h-5 text-blue-600" />;
			case "processing":
				return <Clock className="w-5 h-5 text-amber-600" />;
			default:
				return <Package className="w-5 h-5" />;
		}
	};

	return (
		<div className="space-y-6">
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
				<Link href="/products">
					<Card className="hover:shadow-lg transition-all hover:border-primary-rose cursor-pointer">
						<CardContent className="p-6 text-center">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-rose/20 to-accent-gold/20 flex items-center justify-center">
								<Wallet className="w-8 h-8 text-primary-rose" />
							</div>
							<h3 className="font-bold mb-2">کیف پول</h3>
							<p className="text-sm text-muted-foreground">
                                موجودی {formatPrice(100000)} ریال
							</p>
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
							<p className="text-sm text-muted-foreground">
								{new Intl.NumberFormat("fa-IR").format(
									MOCK_STATS.wishlistItems,
								)}{" "}
								محصول ذخیره شده
							</p>
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
							{MOCK_RECENT_ORDERS.map((order) => (
								<div
									key={order.id}
									className="p-4 hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-center gap-4">
										<img
											src={order.image}
											alt="محصول"
											className="w-16 h-16 object-cover rounded-lg"
										/>

										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<p className="font-semibold">
													سفارش #
													{new Intl.NumberFormat(
														"fa-IR",
													).format(order.id)}
												</p>
												{getStatusBadge(order.status)}
											</div>
											<p className="text-sm text-muted-foreground mb-1">
												{order.date} •{" "}
												{new Intl.NumberFormat(
													"fa-IR",
												).format(order.items)}{" "}
												محصول
											</p>
											<p className="text-lg font-bold gradient-text">
												{formatPrice(order.total)} تومان
											</p>
										</div>

										<div className="flex items-center gap-3">
											{getStatusIcon(order.status)}
											<Link
												href={`/dashboard/orders/${order.id}`}
											>
												<Button
													variant="outline"
													size="sm"
												>
													جزئیات
												</Button>
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
	Package,
	FolderTree,
	Tag,
	TrendingUp,
	TrendingDown,
	Eye,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getData } from "@/services/services";

interface DashboardData {
	productsCount: number;
	categoriesCount: number;
	brandsCount: number;
	revenuePerTier: Array<{ tier: string; revenue: number }>;
	ordersPerDay: Array<{ date: string; count: number }>;
	lowStockProducts: Array<{
		id: number;
		name: string;
		quantity: number;
		minOrder: number;
	}>;
	topProducts: Array<{
		id: number;
		name: string;
		quantity: number;
		revenue: number;
	}>;
}

export default function AdminDashboard() {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchDashboardData = () => {
		setLoading(true);
		getData({ endPoint: `/v1/admin/dashboard` })
			.then((data) => {
				setDashboardData(data?.data);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);
	const stats = useMemo(
		() => [
			{
				title: "مجموع محصولات",
				value: dashboardData?.productsCount || 0,
				icon: Package,
				color: "from-blue-500 to-blue-600",
			},
			{
				title: "دسته‌بندی‌ها",
				value: dashboardData?.categoriesCount || 0,
				icon: FolderTree,
				color: "from-purple-500 to-purple-600",
			},
			{
				title: "برندها",
				value: dashboardData?.brandsCount || 0,
				icon: Tag,
				color: "from-amber-500 to-amber-600",
			},
		],
		[dashboardData],
	);


	return (
		<main className="p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">داشبورد</h1>
				<p className="text-muted-foreground">
					خلاصه‌ای از وضعیت فروشگاه شما
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{stats?.map((stat, i) => (
					<motion.div
						key={stat.title}
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ delay: i * 0.1, type: "spring" }}
						whileHover={{
							y: -8,
							transition: { type: "spring", stiffness: 400 },
						}}
					>
						<Card className="overflow-hidden relative group">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div
										className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
									>
										<stat.icon className="w-6 h-6 text-white" />
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">
										{stat.title}
									</p>
									<motion.p
										className="text-3xl font-bold"
										initial={{ scale: 1 }}
										whileInView={{ scale: [1, 1.1, 1] }}
										viewport={{ once: true }}
										transition={{ duration: 0.5 }}
									>
										{stat.value}
									</motion.p>
								</div>
							</CardContent>

							<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
						</Card>
					</motion.div>
				))}
			</div>

			{/* Revenue Per Tier */}
			{dashboardData?.revenuePerTier && dashboardData.revenuePerTier.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="mb-8"
				>
					<Card>
						<CardHeader>
							<CardTitle>درآمد بر اساس سطح</CardTitle>
							<CardDescription>
								خلاصه درآمد برای هر سطح کاربری
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{dashboardData.revenuePerTier.map((item) => (
									<div
										key={item.tier}
										className="p-4 rounded-lg bg-muted/50 border border-border"
									>
										<p className="text-sm text-muted-foreground mb-1 capitalize">
											{item.tier}
										</p>
										<p className="text-2xl font-bold text-primary-rose">
											{(item.revenue / 1000000).toFixed(1)}M
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Orders Per Day Chart */}
			{dashboardData?.ordersPerDay && dashboardData.ordersPerDay.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="mb-8"
				>
					<Card>
						<CardHeader>
							<CardTitle>سفارشات در 7 روز اخیر</CardTitle>
							<CardDescription>تعداد سفارشات به تفکیک روز</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{dashboardData.ordersPerDay.map((item) => (
									<div
										key={item.date}
										className="flex items-center justify-between"
									>
										<span className="text-sm text-muted-foreground min-w-20">
											{item.date}
										</span>
										<div className="flex-1 mx-4 h-8 bg-muted rounded overflow-hidden">
											<div
												className="h-full bg-gradient-to-r from-primary-rose to-primary-rose/70 transition-all"
												style={{
													width: `${
														((item.count || 0) /
															Math.max(
																...(dashboardData.ordersPerDay.map(
																	(o) => o.count,
																) || [1]),
															)) *
														100
													}%`,
												}}
											/>
										</div>
										<span className="font-bold min-w-12 text-right">
											{item.count}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Low Stock Products */}
			{dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="mb-8"
				>
					<Card className="border-amber-200 bg-amber-50/50">
						<CardHeader>
							<div className="flex items-center gap-2">
								<AlertCircle className="w-5 h-5 text-amber-600" />
								<div>
									<CardTitle>محصولات کم موجودی</CardTitle>
									<CardDescription>
										محصولاتی که موجودی آنها کمتر از حد نصاب است
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>نام محصول</TableHead>
										<TableHead>موجودی</TableHead>
										<TableHead>حد نصاب</TableHead>
										<TableHead>وضعیت</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{dashboardData.lowStockProducts.map((product) => (
										<TableRow key={product.id}>
											<TableCell className="font-medium">
												{product.name}
											</TableCell>
											<TableCell>{product.quantity}</TableCell>
											<TableCell>{product.minOrder}</TableCell>
											<TableCell>
												<Badge variant="destructive">
													کم موجود
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Top Products */}
			{dashboardData?.topProducts && dashboardData.topProducts.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
				>
					<Card>
						<CardHeader>
							<CardTitle>محصولات پرفروش</CardTitle>
							<CardDescription>
								محصولات با بیشترین تعداد فروش
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>نام محصول</TableHead>
										<TableHead>تعداد فروخته شده</TableHead>
										<TableHead>درآمد</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{dashboardData.topProducts.map((product) => (
										<TableRow key={product.id}>
											<TableCell className="font-medium">
												{product.name}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<TrendingUp className="w-4 h-4 text-green-600" />
													{product.quantity}
												</div>
											</TableCell>
											<TableCell className="font-bold text-primary-rose">
												{(product.revenue / 1000000).toFixed(1)}M
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</main>
	);
}

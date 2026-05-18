"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { formatIncome, formatPersianDate } from "@/lib/utils";
import { motion } from "framer-motion";
import {
	PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
	AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
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

type OrderPeriod = "week" | "month" | "year";

const PERIOD_LABELS: Record<OrderPeriod, string> = {
	week: "۷ روز اخیر",
	month: "۳۰ روز اخیر",
	year: "یک سال اخیر",
};

export default function AdminDashboard() {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [orderPeriod, setOrderPeriod] = useState<OrderPeriod>("week");
	const [ordersChart, setOrdersChart] = useState<Array<{ date: string; count: number }>>([]);
	const [ordersChartLoading, setOrdersChartLoading] = useState(false);
	const [salesPeriod, setSalesPeriod] = useState<OrderPeriod>("week");
	const [salesChart, setSalesChart] = useState<Array<{ date: string; revenue: number }>>([]);
	const [salesChartLoading, setSalesChartLoading] = useState(false);

	const fetchDashboardData = () => {
		setLoading(true);
		getData({ endPoint: `/v1/admin/dashboard` })
			.then((data) => {
				setDashboardData(data?.data);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	};

	const fetchOrdersChart = useCallback((period: OrderPeriod) => {
		setOrdersChartLoading(true);
		getData({ endPoint: `/v1/admin/dashboard/orders?period=${period}` })
			.then((data) => {
				setOrdersChart(data?.data ?? []);
			})
			.catch(() => {})
			.finally(() => setOrdersChartLoading(false));
	}, []);

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchSalesChart = useCallback((period: OrderPeriod) => {
		setSalesChartLoading(true);
		getData({ endPoint: `/v1/admin/dashboard/sales?period=${period}` })
			.then((data) => {
				setSalesChart(data?.data ?? []);
			})
			.catch(() => {})
			.finally(() => setSalesChartLoading(false));
	}, []);

	useEffect(() => {
		fetchOrdersChart(orderPeriod);
	}, [orderPeriod, fetchOrdersChart]);

	useEffect(() => {
		fetchSalesChart(salesPeriod);
	}, [salesPeriod, fetchSalesChart]);
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
			{dashboardData?.revenuePerTier &&
				dashboardData.revenuePerTier.length > 0 && (
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
								{(() => {
									const tierNames: Record<string, string> = {
										admin: "مدیر",
										guest: "مهمان",
										regular: "مشتری عادی",
										shopkeeper: "فروشنده",
										shopkeepercash: "فروشنده نقدی",
										shopkeepercheque: "فروشنده چکی",
										fellow: "همکار",
										step1: "سطح ۱",
										step2: "سطح ۲",
										step3: "سطح ۳",
										step4: "سطح ۴",
										bronze: "برنز",
										silver: "نقره",
										gold: "طلا",
										platinum: "پلاتینیوم",
									};
									const COLORS = [
										"#e11d48",
										"#f43f5e",
										"#fb7185",
										"#fda4af",
										"#fecdd3",
									];
									const chartData =
										dashboardData.revenuePerTier
											.filter((item) => item.tier !== "" && item.revenue > 0)
											.map((item) => ({
												name:
													tierNames[
														item.tier.toLowerCase()
													] ?? item.tier,
												value: item.revenue,
											}));
									const total = chartData.reduce(
										(sum, d) => sum + d.value,
										0,
									);
									return (
										<div className="flex flex-col md:flex-row place-content-center place-items-center  items-center gap-6">
											<ResponsiveContainer
												width={260}
												height={260}
											>
												<PieChart>
													<Pie
														data={chartData}
														cx="50%"
														cy="50%"
														outerRadius={110}
														dataKey="value"
														label={false}
													>
														{chartData.map(
															(_, index) => (
																<Cell
																	key={index}
																	fill={
																		COLORS[
																			index %
																				COLORS.length
																		]
																	}
																/>
															),
														)}
													</Pie>
													<Tooltip
														formatter={(
															value: number,
														) => [
															formatIncome(value),
															"درآمد",
														]}
													/>
												</PieChart>
											</ResponsiveContainer>
											<div className="flex flex-col gap-2 text-sm min-w-0">
												{chartData.map(
													(entry, index) => (
														<div
															key={entry.name}
															className="flex items-center gap-2"
														>
															<span
																className="inline-block w-3 h-3 rounded-full shrink-0"
																style={{
																	backgroundColor:
																		COLORS[
																			index %
																				COLORS.length
																		],
																}}
															/>
															<span className="text-muted-foreground">
																{entry.name}
															</span>
															<span className="font-semibold mr-auto">
																{total > 0
																	? `${((entry.value / total) * 100).toFixed(0)}%`
																	: "—"}
															</span>
														</div>
													),
												)}
											</div>
										</div>
									);
								})()}
							</CardContent>
						</Card>
					</motion.div>
				)}

			{/* Orders Chart */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="mb-8"
			>
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between flex-wrap gap-4">
							<div>
								<CardTitle>تعداد سفارشات</CardTitle>
								<CardDescription>{PERIOD_LABELS[orderPeriod]}</CardDescription>
							</div>
							<div className="flex gap-2">
								{(["week", "month", "year"] as OrderPeriod[]).map((p) => (
									<Button
										key={p}
										size="sm"
										variant={orderPeriod === p ? "default" : "outline"}
										onClick={() => setOrderPeriod(p)}
									>
										{PERIOD_LABELS[p]}
									</Button>
								))}
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{ordersChartLoading ? (
							<div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
								در حال بارگذاری...
							</div>
						) : ordersChart.length === 0 ? (
							<div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
								داده‌ای یافت نشد
							</div>
						) : (
							<ResponsiveContainer width="100%" height={260}>
								<AreaChart data={ordersChart} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
									<defs>
										<linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
											<stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
									<XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatPersianDate} />
									<YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
									<Tooltip
										contentStyle={{
										borderRadius: 8,
										fontSize: 13,
										backgroundColor: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										color: "hsl(var(--card-foreground))",
									}}
										formatter={(value: number) => [value, "سفارش"]}
									labelFormatter={formatPersianDate}
									/>
									<Area
										type="monotone"
										dataKey="count"
										stroke="#e11d48"
										strokeWidth={2}
										fill="url(#ordersGradient)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						)}
					</CardContent>
				</Card>
			</motion.div>

			{/* Sales Chart */}
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.45 }}
			className="mb-8"
		>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between flex-wrap gap-4">
						<div>
							<CardTitle>درآمد فروش</CardTitle>
							<CardDescription>{PERIOD_LABELS[salesPeriod]}</CardDescription>
						</div>
						<div className="flex gap-2">
							{(["week", "month", "year"] as OrderPeriod[]).map((p) => (
								<Button
									key={p}
									size="sm"
									variant={salesPeriod === p ? "default" : "outline"}
									onClick={() => setSalesPeriod(p)}
								>
									{PERIOD_LABELS[p]}
								</Button>
							))}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{salesChartLoading ? (
						<div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
							در حال بارگذاری...
						</div>
					) : salesChart.length === 0 ? (
						<div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
							داده‌ای یافت نشد
						</div>
					) : (
						<ResponsiveContainer width="100%" height={260}>
							<AreaChart data={salesChart} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
								<defs>
									<linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatPersianDate} />
								<YAxis
									allowDecimals={false}
									tick={{ fontSize: 11 }}
									tickLine={false}
									axisLine={false}
									width={48}
									tickFormatter={(v: number) => formatIncome(v).split(" ")[0]}
								/>
								<Tooltip
									contentStyle={{
										borderRadius: 8,
										fontSize: 13,
										backgroundColor: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										color: "hsl(var(--card-foreground))",
									}}
									formatter={(value: number) => [formatIncome(value), "درآمد"]}
									labelFormatter={formatPersianDate}
								/>
								<Area
									type="monotone"
									dataKey="revenue"
									stroke="#7c3aed"
									strokeWidth={2}
									fill="url(#salesGradient)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					)}
				</CardContent>
			</Card>
		</motion.div>

		{/* Low Stock Products */}
			{dashboardData?.lowStockProducts &&
				dashboardData.lowStockProducts.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="mb-8"
					>
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<AlertCircle className="w-5 h-5 text-primary-rose" />
									<div>
										<CardTitle>محصولات کم موجودی</CardTitle>
										<CardDescription>
											محصولاتی که موجودی آنها کمتر از حد
											نصاب است
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
										{dashboardData.lowStockProducts.map(
											(product) => (
												<TableRow key={product.id}>
													<TableCell className="font-medium">
														{product.name}
													</TableCell>
													<TableCell>
														{product.quantity}
													</TableCell>
													<TableCell>
														{product.minOrder}
													</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className="text-primary-rose border-primary-rose"
														>
															کم موجود
														</Badge>
													</TableCell>
												</TableRow>
											),
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</motion.div>
				)}

			{/* Top Products */}
			{dashboardData?.topProducts &&
				dashboardData.topProducts.length > 0 && (
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
											<TableHead>
												تعداد فروخته شده
											</TableHead>
											<TableHead>درآمد</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{dashboardData.topProducts.map(
											(product) => (
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
														{formatIncome(
															product.revenue,
														)}
													</TableCell>
												</TableRow>
											),
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</motion.div>
				)}
		</main>
	);
}

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Package, FolderTree, Tag } from "lucide-react";
import { getData } from "@/services/services";
import type { ProvinceStat } from "@/components/IranMap/IranMap";
import StatCards from "@/components/admin/Dashboard/StatCards";
import RevenueChart from "@/components/admin/Dashboard/RevenueChart";
import OrdersVisitsChart from "@/components/admin/Dashboard/OrdersVisitsChart";
import SalesChart from "@/components/admin/Dashboard/SalesChart";
import ProvinceMapCard from "@/components/admin/Dashboard/ProvinceMapCard";
import LowStockTable from "@/components/admin/Dashboard/LowStockTable";
import TopProductsTable from "@/components/admin/Dashboard/TopProductsTable";
import type { Period } from "@/components/admin/Dashboard/PeriodSelector";

interface DashboardData {
	productsCount: number;
	categoriesCount: number;
	brandsCount: number;
	revenuePerTier: Array<{ tier: string; revenue: number }>;
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
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [orderPeriod, setOrderPeriod] = useState<Period>("week");
	const [ordersChart, setOrdersChart] = useState<
		Array<{ date: string; visits: number; orders: number }>
	>([]);
	const [ordersChartLoading, setOrdersChartLoading] = useState(false);
	const [salesPeriod, setSalesPeriod] = useState<Period>("week");
	const [salesChart, setSalesChart] = useState<
		Array<{ date: string; revenue: number }>
	>([]);
	const [salesChartLoading, setSalesChartLoading] = useState(false);
	const [provinceStats, setProvinceStats] = useState<ProvinceStat[]>([]);
	const [provinceStatsLoading, setProvinceStatsLoading] = useState(true);

	const fetchProvinceStats = useCallback(() => {
		setProvinceStatsLoading(true);
		getData({ endPoint: `/v1/admin/dashboard/province-stats` })
			.then((data) => setProvinceStats(data?.data ?? []))
			.catch(() => {})
			.finally(() => setProvinceStatsLoading(false));
	}, []);

	const fetchOrdersChart = useCallback((period: Period) => {
		setOrdersChartLoading(true);
		Promise.all([
			getData({
				endPoint: `/v1/admin/dashboard/visits?period=${period}`,
			}),
			getData({
				endPoint: `/v1/admin/dashboard/orders?period=${period}`,
			}),
		])
			.then(([visitsRes, ordersRes]) => {
				const visitsByDate = new Map(
					(visitsRes?.data ?? []).map(
						(v: { date: string; count: number }) => [
							v.date,
							v.count,
						],
					),
				);
				const ordersByDate = new Map(
					(ordersRes?.data ?? []).map(
						(o: { date: string; count: number }) => [
							o.date,
							o.count,
						],
					),
				);
				const allDates = new Set([
					...visitsByDate.keys(),
					...ordersByDate.keys(),
				]);
				setOrdersChart(
					Array.from(allDates)
						.sort()
						.map((date) => ({
							date,
							visits: visitsByDate.get(date) ?? 0,
							orders: ordersByDate.get(date) ?? 0,
						})),
				);
			})
			.catch(() => {})
			.finally(() => setOrdersChartLoading(false));
	}, []);

	const fetchSalesChart = useCallback((period: Period) => {
		setSalesChartLoading(true);
		getData({ endPoint: `/v1/admin/dashboard/sales?period=${period}` })
			.then((data) => setSalesChart(data?.data ?? []))
			.catch(() => {})
			.finally(() => setSalesChartLoading(false));
	}, []);

	useEffect(() => {
		setLoading(true);
		getData({ endPoint: `/v1/admin/dashboard` })
			.then((data) => setDashboardData(data?.data))
			.catch(() => {})
			.finally(() => setLoading(false));
		fetchProvinceStats();
	}, [fetchProvinceStats]);

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
				route: "products",
			},
			{
				title: "دسته‌بندی‌ها",
				value: dashboardData?.categoriesCount || 0,
				icon: FolderTree,
				color: "from-secondary-plum to-secondary-plum/80",
				route: "categories",
			},
			{
				title: "برندها",
				value: dashboardData?.brandsCount || 0,
				icon: Tag,
				color: "from-amber-500 to-amber-600",
				route: "brands",
			},
		],
		[dashboardData],
	);

	return (
		<main className="p-4 sm:p-6">
			<div className="mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">داشبورد</h1>
				<p className="text-muted-foreground">
					خلاصه‌ای از وضعیت فروشگاه شما
				</p>
			</div>

			<StatCards stats={stats} loading={loading} />
			{dashboardData?.revenuePerTier && (
				<RevenueChart data={dashboardData.revenuePerTier} />
			)}
			<OrdersVisitsChart
				data={ordersChart}
				loading={ordersChartLoading}
				period={orderPeriod}
				onPeriodChange={setOrderPeriod}
			/>
			<SalesChart
				data={salesChart}
				loading={salesChartLoading}
				period={salesPeriod}
				onPeriodChange={setSalesPeriod}
			/>
			<ProvinceMapCard
				data={provinceStats}
				loading={provinceStatsLoading}
			/>
			{dashboardData?.lowStockProducts && (
				<LowStockTable products={dashboardData.lowStockProducts} />
			)}
			{dashboardData?.topProducts && (
				<TopProductsTable products={dashboardData.topProducts} />
			)}
		</main>
	);
}

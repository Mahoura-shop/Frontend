"use client";

import { motion } from "framer-motion";
import {
	AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatPersianDate } from "@/lib/utils";
import PeriodSelector, { PERIOD_LABELS, type Period } from "./PeriodSelector";

const TOOLTIP_STYLE = {
	borderRadius: 8,
	fontSize: 13,
	backgroundColor: "hsl(var(--card))",
	border: "1px solid hsl(var(--border))",
	color: "hsl(var(--card-foreground))",
};

interface Props {
	data: Array<{ date: string; visits: number; orders: number }>;
	loading: boolean;
	period: Period;
	onPeriodChange: (p: Period) => void;
}

export default function OrdersVisitsChart({ data, loading, period, onPeriodChange }: Props) {
	return (
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
							<CardTitle>بازدیدها و سفارشات</CardTitle>
							<CardDescription>{PERIOD_LABELS[period]}</CardDescription>
						</div>
						<PeriodSelector value={period} onChange={onPeriodChange} />
					</div>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
							در حال بارگذاری...
						</div>
					) : data.length === 0 ? (
						<div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
							داده‌ای یافت نشد
						</div>
					) : (
						<ResponsiveContainer width="100%" height={260}>
							<AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
								<defs>
									<linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
									</linearGradient>
									<linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatPersianDate} />
								<YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
								<Tooltip
									contentStyle={TOOLTIP_STYLE}
									formatter={(value: number, name: string) => [value, name === "visits" ? "بازدید" : "سفارش"]}
									labelFormatter={formatPersianDate}
								/>
								<Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} fill="url(#visitsGradient)" name="visits" />
								<Area type="monotone" dataKey="orders" stroke="#e11d48" strokeWidth={2} fill="url(#ordersGradient)" name="orders" />
							</AreaChart>
						</ResponsiveContainer>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}

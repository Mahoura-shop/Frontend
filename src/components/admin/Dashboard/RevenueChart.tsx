"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatIncome } from "@/lib/utils";

const TIER_NAMES: Record<string, string> = {
	admin: "مدیر",
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

const COLORS = ["#e11d48", "#f43f5e", "#fb7185", "#fda4af", "#fecdd3"];

const tooltipStyle = {
	background: "hsl(var(--card))",
	border: "1px solid hsl(var(--border))",
	borderRadius: 8,
	padding: "8px 12px",
	color: "hsl(var(--card-foreground))",
};

interface Props {
	data: Array<{ tier: string; revenue: number }>;
}

export default function RevenueChart({ data }: Props) {
	const chartData = data
		.filter((item) => item.tier !== "" && item.revenue > 0)
		.map((item) => ({
			name: TIER_NAMES[item.tier.toLowerCase()] ?? item.tier,
			value: item.revenue,
		}));

	if (chartData.length === 0) return null;

	const total = chartData.reduce((sum, d) => sum + d.value, 0);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
			className="mb-8"
		>
			<Card>
				<CardHeader>
					<CardTitle>درآمد بر اساس سطح</CardTitle>
					<CardDescription>خلاصه درآمد برای هر سطح کاربری</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row place-content-center place-items-center items-center gap-6">
						<ResponsiveContainer width={260} height={260}>
							<PieChart>
								<Pie data={chartData} cx="50%" cy="50%" outerRadius={110} dataKey="value" label={false}>
									{chartData.map((_, index) => (
										<Cell key={index} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									content={({ active, payload }) => {
										if (!active || !payload?.length) return null;
										const { name, value } = payload[0];
										return (
											<div style={tooltipStyle}>
												<div style={{ fontWeight: 600, marginBottom: 2 }}>{name}</div>
												<div style={{ fontSize: 12, opacity: 0.75 }}>
													درآمد: {formatIncome(value as number)}
												</div>
											</div>
										);
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="flex flex-col gap-2 text-sm min-w-0">
							{chartData.map((entry, index) => (
								<div key={entry.name} className="flex items-center gap-2">
									<span
										className="inline-block w-3 h-3 rounded-full shrink-0"
										style={{ backgroundColor: COLORS[index % COLORS.length] }}
									/>
									<span className="text-muted-foreground">{entry.name}</span>
									<span className="font-semibold mr-auto">
										{total > 0 ? `${((entry.value / total) * 100).toFixed(0)}%` : "—"}
									</span>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

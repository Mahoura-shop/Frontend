"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ProvinceStat } from "@/components/IranMap/IranMap";

const IranMap = dynamic(() => import("@/components/IranMap/IranMap"), {
	ssr: false,
	loading: () => (
		<div className="h-[400px] flex items-center justify-center text-muted-foreground text-sm">
			در حال بارگذاری نقشه...
		</div>
	),
});

interface Props {
	data: ProvinceStat[];
	loading: boolean;
}

export default function ProvinceMapCard({ data, loading }: Props) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
			className="mb-8"
		>
			<Card>
				<CardHeader>
					<CardTitle>سفارشات بر اساس استان</CardTitle>
					<CardDescription>توزیع جغرافیایی سفارشات و فروش در سطح کشور</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="h-[400px] flex items-center justify-center text-muted-foreground text-sm">
							در حال بارگذاری...
						</div>
					) : (
						<IranMap data={data} />
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}

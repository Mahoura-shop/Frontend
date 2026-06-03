"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Stat {
	title: string;
	value: number;
	icon: LucideIcon;
	color: string;
	route: string;
}

interface Props {
	stats: Stat[];
	loading: boolean;
}

export default function StatCards({ stats, loading }: Props) {
	const router = useRouter();
	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="pb-3">
							<Skeleton className="w-12 h-12 rounded-lg" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-4 w-24 mb-2" />
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-testid="stat-cards">
			{stats.map((stat, i) => (
				<motion.div
					key={stat.title}
					initial={{ opacity: 0, y: 20, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ delay: i * 0.1, type: "spring" }}
					whileHover={{
						y: -8,
						transition: { type: "spring", stiffness: 400 },
					}}
					onClick={() => router.push(stat.route)}
				>
					<Card className="overflow-hidden relative group">
						<CardHeader className="pb-3">
							<div
								className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
							>
								<stat.icon className="w-6 h-6 text-white" />
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
	);
}

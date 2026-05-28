"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatIncome } from "@/lib/utils";

interface TopProduct {
	id: number;
	name: string;
	quantity: number;
	revenue: number;
}

interface Props {
	products: TopProduct[];
}

export default function TopProductsTable({ products }: Props) {
	if (!products || products.length === 0) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
		>
			<Card>
				<CardHeader>
					<CardTitle>محصولات پرفروش</CardTitle>
					<CardDescription>محصولات با بیشترین تعداد فروش</CardDescription>
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
							{products.map((product) => (
								<TableRow key={product.id}>
									<TableCell className="font-medium">{product.name}</TableCell>
									<TableCell>{product.quantity}</TableCell>
									<TableCell className="font-bold text-primary-rose">
										{formatIncome(product.revenue)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</motion.div>
	);
}

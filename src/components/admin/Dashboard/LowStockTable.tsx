"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LowStockProduct {
	id: number;
	name: string;
	quantity: number;
	minOrder: number;
}

interface Props {
	products: LowStockProduct[];
}

export default function LowStockTable({ products }: Props) {
	if (!products || products.length === 0) return null;

	return (
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
							<CardDescription>محصولاتی که موجودی آنها کمتر از حد نصاب است</CardDescription>
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
							{products.map((product) => (
								<TableRow key={product.id}>
									<TableCell className="font-medium">{product.name}</TableCell>
									<TableCell>{product.quantity}</TableCell>
									<TableCell>{product.minOrder}</TableCell>
									<TableCell>
										<Badge variant="outline" className="text-primary-rose border-primary-rose">
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
	);
}

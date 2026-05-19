"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Button from "@/components/Custom/Button/Button";
import ProductCombobox from "@/components/admin/ProductCombobox/ProductCombobox";
import { getData } from "@/services/services";
import { productService } from "@/services/productService";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import PermissionGuard from "@/components/admin/PermissionGuard";

interface StockRow {
	id: string;
	productID: number | null;
	count: string;
}

function makeRow(): StockRow {
	return { id: crypto.randomUUID(), productID: null, count: "" };
}

function InventoryPageContent() {
	const [products, setProducts] = useState<Product[]>([]);
	const [operationType, setOperationType] = useState<"buy" | "sell">("buy");
	const [rows, setRows] = useState<StockRow[]>([makeRow()]);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		getData({ endPoint: "/v1/product" }).then((res) => {
			console.log("res", res);
			setProducts(res?.data ?? []);
		});
	}, []);

	function addRow() {
		setRows((prev) => [...prev, makeRow()]);
	}

	function removeRow(id: string) {
		setRows((prev) =>
			prev.length === 1 ? prev : prev.filter((r) => r.id !== id),
		);
	}

	function updateRow(id: string, patch: Partial<Omit<StockRow, "id">>) {
		setRows((prev) =>
			prev?.map((r) => (r.id === id ? { ...r, ...patch } : r)),
		);
	}

	async function handleSubmit() {
		const invalid = rows.some(
			(r) => r.productID === null || !r.count || Number(r.count) <= 0,
		);
		if (invalid) {
			CustomToast(
				"لطفا برای همه ردیف‌ها محصول و تعداد معتبر وارد کنید",
				"error",
			);
			return;
		}

		const items = rows?.map((r) => ({
			productID: r.productID as number,
			count: Number(r.count),
		}));

		setSubmitting(true);
		try {
			await productService.batchUpdateStock(operationType, items);
			CustomToast("موجودی با موفقیت ثبت شد", "success");
			setRows([makeRow()]);
		} catch {
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="container mx-auto p-6 space-y-6 font-vazirmatn"
			dir="rtl"
		>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">ورود / خروج موجودی</h1>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>نوع عملیات</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setOperationType("buy")}
							className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
								operationType === "buy"
									? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
									: "border-border bg-background text-muted-foreground hover:border-muted-foreground"
							}`}
						>
							<ArrowDownCircle className="size-4" />
							خرید (ورودی)
						</button>
						<button
							type="button"
							onClick={() => setOperationType("sell")}
							className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
								operationType === "sell"
									? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
									: "border-border bg-background text-muted-foreground hover:border-muted-foreground"
							}`}
						>
							<ArrowUpCircle className="size-4" />
							فروش (خروجی)
						</button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>ردیف‌های موجودی</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{rows?.map((row, index) => (
						<motion.div
							key={row.id}
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
							className="flex items-center gap-3"
						>
							<div className="flex-1 min-w-0">
								<ProductCombobox
									value={row.productID}
									onChange={(id) =>
										updateRow(row.id, { productID: id })
									}
									products={products?.map((p) => ({
										id: p.id,
										name: p.name,
									}))}
									label="محصول"
								/>
							</div>
							<div className="w-20 sm:w-40 relative shrink-0">
								<Input
									type="number"
									min={1}
									value={row.count}
									onChange={(e) =>
										updateRow(row.id, {
											count: e.target.value,
										})
									}
									placeholder="تعداد"
									className="h-[45px] rounded-xl border-[1.5px] text-right font-vazirmatn"
								/>
							</div>
							<button
								type="button"
								onClick={() => removeRow(row.id)}
								disabled={rows.length === 1}
								className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
							>
								<Trash2 className="size-4" />
							</button>
						</motion.div>
					))}

					<button
						type="button"
						onClick={addRow}
						className="flex items-center gap-2 mt-2 text-sm text-primary-rose hover:opacity-70 transition-opacity font-medium"
					>
						<Plus className="size-4" />
						افزودن ردیف
					</button>
				</CardContent>
			</Card>

			<div className="flex justify-end">
				<Button
					variant="primary"
					onClick={handleSubmit}
					disabled={submitting}
					className="px-8"
				>
					{submitting ? "در حال ثبت..." : "ثبت موجودی"}
				</Button>
			</div>
		</motion.div>
	);
}

export default function InventoryPage() {
	return (
		<PermissionGuard permission="product:batch_inventory">
			<InventoryPageContent />
		</PermissionGuard>
	);
}

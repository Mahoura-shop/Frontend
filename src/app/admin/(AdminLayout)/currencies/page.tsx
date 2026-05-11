"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Loader2, Pencil, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getData, putData } from "@/services/services";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { formatPrice } from "@/utils/formatPrice";

interface Currency {
	id: number;
	name: string;
	code: string;
	convertRate: number;
}

export default function AdminCurrenciesPage() {
	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editValues, setEditValues] = useState<{ name: string; code: string; convertRate: string }>({ name: "", code: "", convertRate: "" });
	const [saving, setSaving] = useState(false);

	const load = () => {
		setLoading(true);
		getData({ endPoint: "/v1/currency" })
			.then((res) => setCurrencies(res?.data ?? []))
			.finally(() => setLoading(false));
	};

	useEffect(() => { load(); }, []);

	const startEdit = (c: Currency) => {
		setEditingId(c.id);
		setEditValues({ name: c.name, code: c.code, convertRate: String(c.convertRate) });
	};

	const cancelEdit = () => setEditingId(null);

	const saveEdit = async (id: number) => {
		setSaving(true);
		try {
			await putData({
				endPoint: `/v1/currency/${id}`,
				data: {
					name: editValues.name,
					code: editValues.code,
					convertRate: Number(editValues.convertRate),
				},
			});
			CustomToast("ارز بروز شد", "success");
			setEditingId(null);
			load();
		} catch {
			CustomToast("خطا در بروزرسانی", "error");
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className="p-6">
			<div className="flex items-center gap-3 mb-8">
				<Coins className="w-7 h-7 text-primary-rose" />
				<h1 className="text-3xl font-bold">ارزها</h1>
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{currencies.map((c, i) => (
						<motion.div
							key={c.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.06, type: "spring" }}
						>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-base flex items-center justify-between">
										{editingId === c.id ? (
											<input
												className="border rounded px-2 py-1 text-sm bg-background w-32 focus:outline-none focus:ring-2 focus:ring-primary-rose/50"
												value={editValues.name}
												onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
											/>
										) : (
											<span>{c.name}</span>
										)}
										<span className="text-xs font-mono text-muted-foreground">
											{editingId === c.id ? (
												<input
													className="border rounded px-2 py-1 text-xs bg-background w-16 focus:outline-none focus:ring-2 focus:ring-primary-rose/50"
													value={editValues.code}
													onChange={(e) => setEditValues((v) => ({ ...v, code: e.target.value }))}
												/>
											) : c.code}
										</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<p className="text-xs text-muted-foreground mb-1">نرخ تبدیل (ریال)</p>
										{editingId === c.id ? (
											<input
												type="number"
												className="border rounded px-2 py-1 text-sm bg-background w-full focus:outline-none focus:ring-2 focus:ring-primary-rose/50"
												value={editValues.convertRate}
												onChange={(e) => setEditValues((v) => ({ ...v, convertRate: e.target.value }))}
											/>
										) : (
											<p className="font-bold text-primary-rose">
												{formatPrice(c.convertRate)} ریال
											</p>
										)}
									</div>
									<div className="flex gap-2">
										{editingId === c.id ? (
											<>
												<Button size="sm" className="flex-1 gap-1" onClick={() => saveEdit(c.id)} disabled={saving}>
													{saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
													ذخیره
												</Button>
												<Button size="sm" variant="outline" onClick={cancelEdit} disabled={saving}>
													<X className="w-3 h-3" />
												</Button>
											</>
										) : (
											<Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => startEdit(c)}>
												<Pencil className="w-3 h-3" />
												ویرایش
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			)}
		</main>
	);
}

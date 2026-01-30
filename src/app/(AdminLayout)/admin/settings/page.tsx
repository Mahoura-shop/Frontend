"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/store/useSettingsStore";
import { toast } from "sonner";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";

export default function SettingsPage() {
	const { currencyRates, updateRate } = useSettingsStore();
	const [editedRates, setEditedRates] = useState(currencyRates);

	const handleRateChange = (code: string, value: string) => {
		const numValue = parseFloat(value) || 0;
		setEditedRates((prev) =>
			prev.map((rate) =>
				rate.code === code ? { ...rate, rate: numValue } : rate,
			),
		);
	};

	const handleSave = () => {
		editedRates.forEach((rate) => {
			if (rate.code !== "IRR") {
				updateRate(rate.code, rate.rate);
			}
		});
		CustomToast("تنظیمات با موفقیت ذخیره شد", "success");
	};

	const handleReset = () => {
		setEditedRates(currencyRates);
		CustomToast("تغییرات لغو شد", "info");
	};

	return (
		<main className="p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">تنظیمات</h1>
				<p className="text-muted-foreground">مدیریت تنظیمات فروشگاه</p>
			</div>

			{/* Currency Rates */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<DollarSign className="w-5 h-5" />
							نرخ ارزها
						</CardTitle>
						<CardDescription>
							نرخ تبدیل ارزهای مختلف به ریال ایران. قیمت محصولات
							بر اساس این نرخ‌ها تبدیل می‌شود.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-2 gap-6">
							{editedRates.map((currency, i) => (
								<motion.div
									key={currency.code}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.1 }}
									className="space-y-2"
								>
									<Label
										htmlFor={currency.code}
										className="flex items-center justify-between"
									>
										<span className="flex items-center gap-2">
											<span className="text-2xl">
												{currency.symbol}
											</span>
											<span className="font-bold">
												{currency.nameFa}
											</span>
											<span className="text-sm text-muted-foreground">
												({currency.code})
											</span>
										</span>
									</Label>
									<div className="flex items-center gap-2">
										<span className="text-sm text-muted-foreground whitespace-nowrap">
											1 {currency.code} =
										</span>
										<Input
											id={currency.code}
											type="number"
											value={currency.rate}
											onChange={(e) =>
												handleRateChange(
													currency.code,
													e.target.value,
												)
											}
											disabled={currency.code === "IRR"}
											className="text-left"
										/>
										<span className="text-sm text-muted-foreground whitespace-nowrap">
											ریال
										</span>
									</div>
									{currency.code !== "IRR" && (
										<p className="text-xs text-muted-foreground">
											۱۰۰ {currency.code} ={" "}
											{new Intl.NumberFormat(
												"fa-IR",
											).format(currency.rate * 100)}{" "}
											ریال
										</p>
									)}
								</motion.div>
							))}
						</div>

						<div className="flex gap-4 mt-8 pt-6 border-t">
							<Button onClick={handleSave} className="gap-2">
								<Save className="w-4 h-4" />
								ذخیره تغییرات
							</Button>
							<Button
								variant="outline"
								onClick={handleReset}
								className="gap-2"
							>
								<RefreshCw className="w-4 h-4" />
								لغو تغییرات
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Example Conversions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="mt-6"
			>
				<Card>
					<CardHeader>
						<CardTitle>مثال تبدیل ارز</CardTitle>
						<CardDescription>
							نمونه‌ای از تبدیل قیمت‌ها
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-3 gap-4">
							{editedRates
								.filter((c) => c.code !== "IRR")
								.slice(0, 3)
								.map((currency) => {
									const examplePrice = 100;
									const irrPrice =
										examplePrice * currency.rate;
									return (
										<div
											key={currency.code}
											className="p-4 rounded-lg bg-muted/50 border"
										>
											<p className="text-sm text-muted-foreground mb-2">
												قیمت به {currency.nameFa}
											</p>
											<p className="text-2xl font-bold mb-1">
												{examplePrice} {currency.symbol}
											</p>
											<p className="text-sm">
												معادل:{" "}
												<span className="font-bold gradient-text">
													{new Intl.NumberFormat(
														"fa-IR",
													).format(irrPrice)}
												</span>{" "}
												ریال
											</p>
										</div>
									);
								})}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</main>
	);
}

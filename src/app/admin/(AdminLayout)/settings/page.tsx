"use client";

import { useEffect, useState } from "react";
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
import { getData, putData } from "@/services/services";
import { Skeleton } from "@/components/ui/skeleton";
import Input from "@/components/Custom/Input/Input";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import InputFree from "@/components/Custom/Input/InputFree";
import PermissionGuard from "@/components/admin/PermissionGuard";

function SettingsPageContent() {
	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchCurrencies = () => {
		setLoading(true);
		getData({ endPoint: `/v1/currency` }).then((data) => {
			setCurrencies(data?.data);
		}).finally(() => setLoading(false));
	};

	const saveAllCurrencies = async () => {
		for (const currency of currencies) {
			if (currency.code === "IRR") continue;

			await putData({
				endPoint: `/v1/currency/${currency.id}`,
				data: currency,
			});
		}
		CustomToast("تغییرات با موفقیت ذخیره شد", "success");
	};
	useEffect(() => {
		fetchCurrencies();
	}, []);

	const handleRateChange = (id: number, value: string) => {
		setCurrencies((prev) =>
			prev?.map((currency) =>
				currency.id === id
					? { ...currency, convertRate: Number(value) }
					: currency,
			),
		);
	};

	return (
		<main className="p-4 sm:p-6">
			<div className="mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">تنظیمات</h1>
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
							{loading ? (
								Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="space-y-2">
										<div className="flex items-center gap-2">
											<Skeleton className="h-4 w-20" />
											<Skeleton className="h-10 flex-1 rounded-md" />
											<Skeleton className="h-4 w-8" />
										</div>
									</div>
								))
							) : currencies?.map((currency, i) => (
								<motion.div
									key={currency.code}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.1 }}
									className="space-y-2"
								>
									<div className="flex items-center gap-2">
										<span className="text-sm text-muted-foreground whitespace-nowrap">
											1 {currency.code} =
										</span>
										<InputFree
											label={`${currency.name} (${currency.code})`}
											icon={DollarSign}
											isPriceInput
											value={currency.convertRate}
											onValueChange={(v: string) =>
												handleRateChange(currency.id, v)
											}
											disabled={currency.code === "IRR"}
											inputClassName="text-left"
											data-testid={`currency-rate-${currency.code}`}
										/>
										<span className="text-sm text-muted-foreground whitespace-nowrap">
											ریال
										</span>
									</div>
									{currency.code !== "IRR" && (
										<p className="text-xs text-muted-foreground">
											{new Intl.NumberFormat(
												"fa-IR",
											).format(1)}{" "}
											{currency.name} ={" "}
											{new Intl.NumberFormat(
												"fa-IR",
											).format(currency.convertRate)}{" "}
											ریال
										</p>
									)}
								</motion.div>
							))}
						</div>

						<div className="flex gap-4 mt-8 pt-6 border-t">
							<Button
								data-testid="save-currencies"
								onClick={saveAllCurrencies}
								className="gap-2"
							>
								<Save className="w-4 h-4" />
								ذخیره تغییرات
							</Button>
							<Button
								variant="outline"
								onClick={fetchCurrencies}
								className="gap-2"
							>
								<RefreshCw className="w-4 h-4" />
								لغو تغییرات
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</main>
	);
}

export default function SettingsPage() {
	return (
		<PermissionGuard permission="update:currencies">
			<SettingsPageContent />
		</PermissionGuard>
	);
}

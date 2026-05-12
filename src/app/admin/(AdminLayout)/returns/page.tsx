"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PackageX, Loader2, Check, X, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminReturns, reviewReturn, processRefund } from "@/services/returnService";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";

interface ReturnRequest {
	id: number;
	orderItemID: number;
	productName: string;
	userPhone: string;
	status: string;
	reason: string;
	quantity: number;
	refundAmount: number;
	requestedAt: string;
}

const STATUS_LABELS: Record<string, string> = {
	requested: "در انتظار بررسی",
	approved: "تایید شده",
	rejected: "رد شده",
	shipped_back: "ارسال شده",
	received: "دریافت شده",
	refunded: "مبلغ برگشت داده شد",
};

export default function AdminReturnsPage() {
	const [returns, setReturns] = useState<ReturnRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("");
	const [acting, setActing] = useState<number | null>(null);

	const load = (status?: string) => {
		setLoading(true);
		getAdminReturns(status)
			.then((res) => setReturns(res?.data ?? []))
			.catch(() => setReturns([]))
			.finally(() => setLoading(false));
	};

	useEffect(() => { load(); }, []);

	const handleFilter = (status: string) => {
		setFilter(status);
		load(status || undefined);
	};

	const handleReview = async (id: number, action: "approve" | "reject") => {
		setActing(id);
		try {
			await reviewReturn(id, { action });
			CustomToast(action === "approve" ? "مرجوعی تایید شد" : "مرجوعی رد شد", "success");
			load(filter || undefined);
		} catch {
			CustomToast("خطا در بررسی مرجوعی", "error");
		} finally {
			setActing(null);
		}
	};

	const handleRefund = async (id: number) => {
		setActing(id);
		try {
			await processRefund(id);
			CustomToast("مبلغ به کیف پول کاربر برگشت داده شد", "success");
			load(filter || undefined);
		} catch {
			CustomToast("خطا در پردازش استرجاع", "error");
		} finally {
			setActing(null);
		}
	};

	const filters = [
		{ value: "", label: "همه" },
		{ value: "requested", label: "در انتظار" },
		{ value: "approved", label: "تایید شده" },
		{ value: "rejected", label: "رد شده" },
		{ value: "refunded", label: "مرجوع شده" },
	];

	return (
		<main className="p-6">
			<div className="mb-8 flex items-center gap-3">
				<PackageX className="w-7 h-7 text-primary-rose" />
				<h1 className="text-3xl font-bold">مدیریت مرجوعی‌ها</h1>
			</div>

			<div className="flex gap-2 flex-wrap mb-6">
				{filters.map((f) => (
					<Button
						key={f.value}
						size="sm"
						variant={filter === f.value ? "luxury" : "outline"}
						onClick={() => handleFilter(f.value)}
					>
						{f.label}
					</Button>
				))}
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
				</div>
			) : returns.length === 0 ? (
				<div className="text-center py-20 text-muted-foreground">
					<PackageX className="w-12 h-12 mx-auto mb-4 opacity-40" />
					<p>مرجوعی‌ای یافت نشد</p>
				</div>
			) : (
				<div className="space-y-4">
					{returns.map((r, i) => (
						<motion.div
							key={r.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.04, type: "spring" }}
						>
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-base flex items-center justify-between flex-wrap gap-2">
										<span>{r.productName}</span>
										<Badge variant={r.status === "refunded" ? "available" : r.status === "rejected" ? "outOfStock" : "default"}>
											{STATUS_LABELS[r.status] ?? r.status}
										</Badge>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
										<div>
											<p className="text-xs text-muted-foreground mb-1">مشتری</p>
											<p className="font-medium">{r.userPhone}</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground mb-1">تعداد</p>
											<p className="font-medium">{new Intl.NumberFormat("fa-IR").format(r.quantity)}</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground mb-1">مبلغ استرجاع</p>
											<p className="font-bold text-primary-rose">{formatPrice(r.refundAmount)} تومان</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground mb-1">تاریخ درخواست</p>
											<p className="font-medium">{formatDate(r.requestedAt)}</p>
										</div>
									</div>
									<p className="text-sm text-muted-foreground border-t pt-2">
										دلیل: {r.reason}
									</p>

									{r.status === "requested" && (
										<div className="flex gap-2 pt-1">
											<Button
												size="sm"
												className="gap-1"
												onClick={() => handleReview(r.id, "approve")}
												disabled={acting === r.id}
											>
												{acting === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
												تایید
											</Button>
											<Button
												size="sm"
												variant="destructive"
												className="gap-1"
												onClick={() => handleReview(r.id, "reject")}
												disabled={acting === r.id}
											>
												<X className="w-3 h-3" />
												رد
											</Button>
										</div>
									)}

									{r.status === "approved" && (
										<div className="flex gap-2 pt-1">
											<Button
												size="sm"
												variant="outline"
												className="gap-1 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
												onClick={() => handleRefund(r.id)}
												disabled={acting === r.id}
											>
												{acting === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
												پرداخت استرجاع
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			)}
		</main>
	);
}

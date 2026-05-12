"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PackageX, Loader2, Clock, Check, X, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMyReturns } from "@/services/returnService";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";

interface ReturnRequest {
	id: number;
	orderItemID: number;
	productName: string;
	status: string;
	reason: string;
	quantity: number;
	refundAmount: number;
	requestedAt: string;
	approvedAt?: string;
	refundedAt?: string;
}

const STATUS_MAP: Record<string, { label: string; icon: React.ElementType; color: string }> = {
	requested: { label: "در انتظار بررسی", icon: Clock, color: "text-amber-600" },
	approved: { label: "تایید شده", icon: Check, color: "text-blue-600" },
	rejected: { label: "رد شده", icon: X, color: "text-red-600" },
	shipped_back: { label: "ارسال شده", icon: PackageX, color: "text-purple-600" },
	received: { label: "دریافت شده", icon: Check, color: "text-green-600" },
	refunded: { label: "مبلغ برگشت داده شد", icon: RefreshCw, color: "text-green-700" },
};

export default function CustomerReturnsPage() {
	const [returns, setReturns] = useState<ReturnRequest[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getMyReturns()
			.then((res) => setReturns(res?.data ?? []))
			.catch(() => setReturns([]))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
					<h1 className="text-4xl font-bold gradient-text mb-2">مرجوعی‌ها</h1>
					<p className="text-muted-foreground">پیگیری درخواست‌های مرجوعی</p>
				</motion.div>

				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
					</div>
				) : returns.length === 0 ? (
					<div className="text-center py-20 text-muted-foreground">
						<PackageX className="w-16 h-16 mx-auto mb-4 opacity-40" />
						<p>درخواست مرجوعی ندارید</p>
					</div>
				) : (
					<div className="space-y-4">
						{returns.map((r, i) => {
							const s = STATUS_MAP[r.status] ?? STATUS_MAP.requested;
							const Icon = s.icon;
							return (
								<motion.div
									key={r.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.06, type: "spring" }}
								>
									<Card>
										<CardContent className="p-5">
											<div className="flex items-start justify-between gap-4 flex-wrap">
												<div className="flex-1 min-w-0">
													<p className="font-semibold text-lg mb-1">{r.productName}</p>
													<p className="text-sm text-muted-foreground mb-2">
														تعداد: {new Intl.NumberFormat("fa-IR").format(r.quantity)} — {r.reason}
													</p>
													<p className="text-xs text-muted-foreground">
														{formatDate(r.requestedAt)}
													</p>
												</div>
												<div className="text-left shrink-0">
													<p className="text-xl font-bold text-primary-rose mb-1">
														{formatPrice(r.refundAmount)} تومان
													</p>
													<div className={`flex items-center gap-1 text-sm font-medium ${s.color}`}>
														<Icon className="w-4 h-4" />
														{s.label}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

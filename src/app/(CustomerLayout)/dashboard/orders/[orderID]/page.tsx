"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	Package,
	ArrowRight,
	Clock,
	CheckCircle2,
	Truck,
	XCircle,
	CreditCard,
	MapPin,
	Wallet,
	Calendar,
	RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate, formatDateLong } from "@/utils/formatDate";
import {
	getOrderDetail,
	payByWallet,
	initiatePayment,
	getOrderInstalments,
} from "@/services/orderService";
import { requestReturn } from "@/services/returnService";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";

interface StatusHistory {
	status: number;
	note: string;
	changedByID: number;
	createdAt: string;
}

interface OrderItem {
	id: number;
	count: number;
	priceSnapshot: number;
	tier: number;
	product: {
		id: number;
		name: string;
		productPic: string;
		brand: { name: string } | null;
	};
}

interface Instalment {
	id: number;
	number: number;
	amount: number;
	dueDate: string;
	status: number;
	paidAt: string | null;
}

interface Order {
	id: number;
	status: number;
	paymentMethod: number;
	totalAmount: number;
	shippingCost: number;
	refundFlag: boolean;
	trackingCode?: string;
	createdAt: string;
	items: OrderItem[];
	statusHistory: StatusHistory[];
}

const STATUS_MAP: Record<
	number,
	{
		label: string;
		variant: "available" | "new" | "outOfStock" | "default" | "secondary";
		icon: React.ElementType;
		color: string;
	}
> = {
	1: {
		label: "در انتظار پرداخت",
		variant: "outOfStock",
		icon: Clock,
		color: "text-amber-600",
	},
	2: {
		label: "پرداخت شده",
		variant: "new",
		icon: CreditCard,
		color: "text-blue-600",
	},
	3: {
		label: "ارسال شده",
		variant: "new",
		icon: Truck,
		color: "text-blue-600",
	},
	5: {
		label: "لغو شده",
		variant: "secondary",
		icon: XCircle,
		color: "text-muted-foreground",
	},
};

const PAYMENT_METHOD_MAP: Record<number, string> = {
	1: "نقدی",
	2: "اقساطی",
	3: "آنلاین (زرین‌پال)",
	4: "کیف پول",
};

const STATUS_STEPS = [
	{ status: 1, label: "ثبت سفارش" },
	{ status: 2, label: "پرداخت شده" },
	{ status: 3, label: "ارسال شده" },
];

const INSTALMENT_STATUS_MAP: Record<number, { label: string; color: string }> =
	{
		1: { label: "در انتظار", color: "text-amber-600" },
		2: { label: "پرداخت شده", color: "text-green-600" },
		3: { label: "سررسید گذشته", color: "text-red-600" },
	};

export default function OrderDetailPage() {
	const { orderID } = useParams<{ orderID: string }>();
	const [order, setOrder] = useState<Order | null>(null);
	const [instalments, setInstalments] = useState<Instalment[]>([]);
	const [loading, setLoading] = useState(true);
	const [paying, setPaying] = useState(false);
	const [returningItemID, setReturningItemID] = useState<number | null>(null);
	const [returnReason, setReturnReason] = useState("");
	const [returnQty, setReturnQty] = useState(1);
	const [submittingReturn, setSubmittingReturn] = useState(false);

	useEffect(() => {
		const fetch = async () => {
			try {
				const res = await getOrderDetail(Number(orderID));
				setOrder(res?.data ?? null);
				const instRes = await getOrderInstalments(Number(orderID));
				setInstalments(instRes?.data ?? []);
			} catch {
				setOrder(null);
				setInstalments([]);
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, [orderID]);

	const handlePayWallet = async () => {
		if (!order) return;
		setPaying(true);
		try {
			await payByWallet(order.id);
			CustomToast("پرداخت با موفقیت انجام شد!", "success");
			const res = await getOrderDetail(order.id);
			setOrder(res?.data ?? order);
		} catch {
		} finally {
			setPaying(false);
		}
	};

	const handlePayGateway = async () => {
		if (!order) return;
		setPaying(true);
		try {
			const res = await initiatePayment(order.id);
			const url: string = res?.data?.gatewayURL;
			if (url) window.location.href = url;
			else CustomToast("خطا در اتصال به درگاه", "error");
		} catch {
		} finally {
			setPaying(false);
		}
	};

	const handleRequestReturn = async (itemID: number) => {
		if (!returnReason.trim()) {
			CustomToast("لطفا دلیل مرجوعی را وارد کنید", "error");
			return;
		}
		setSubmittingReturn(true);
		try {
			await requestReturn({
				orderItemID: itemID,
				reason: returnReason,
				quantity: returnQty,
			});
			CustomToast("درخواست مرجوعی ثبت شد", "success");
			setReturningItemID(null);
			setReturnReason("");
			setReturnQty(1);
		} catch {
			CustomToast("خطا در ثبت درخواست مرجوعی", "error");
		} finally {
			setSubmittingReturn(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div>
					<Skeleton className="h-4 w-32 mb-4" />
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-36" />
						</div>
						<Skeleton className="h-7 w-24 rounded-full" />
					</div>
				</div>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="flex flex-col items-center gap-2">
									<Skeleton className="w-10 h-10 rounded-full" />
									<Skeleton className="h-3 w-16" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
				<div className="grid md:grid-cols-3 gap-6">
					<div className="md:col-span-2">
						<Card>
							<CardContent className="p-4 space-y-1">
								{Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className="flex items-center gap-4 py-3 border-b last:border-b-0">
										<Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-40" />
											<Skeleton className="h-3 w-24" />
										</div>
										<Skeleton className="h-5 w-20" />
									</div>
								))}
							</CardContent>
						</Card>
					</div>
					<div className="space-y-4">
						<Card>
							<CardContent className="p-4 space-y-3">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="flex justify-between">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-4 w-20" />
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="text-center py-20">
				<p className="text-muted-foreground mb-4">سفارش یافت نشد</p>
				<Link href="/dashboard/orders">
					<Button variant="outline">بازگشت به سفارش‌ها</Button>
				</Link>
			</div>
		);
	}

	const status = STATUS_MAP[order.status] ?? STATUS_MAP[1];
	const StatusIcon = status.icon;
	const progressFraction = (Math.min(order.status, 3) - 1) / 2;

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<Link
					href="/dashboard/orders"
					className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm"
				>
					<ArrowRight className="w-4 h-4" />
					بازگشت به سفارش‌ها
				</Link>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold gradient-text">
							سفارش #
							{new Intl.NumberFormat("fa-IR").format(order.id)}
						</h1>
						<p className="text-sm text-muted-foreground mt-1">
							{formatDateLong(order.createdAt)}
						</p>
					</div>
					<Badge
						variant={status.variant}
						className="text-sm px-3 py-1"
					>
						<StatusIcon className="w-4 h-4 me-1" />
						{status.label}
					</Badge>
				</div>
			</motion.div>

			{/* Progress tracker (non-cancelled) */}
			{order.status !== 5 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between relative">
								<div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
								<div
									className="absolute top-5 right-5 h-0.5 bg-gradient-to-l from-primary-rose to-accent-gold transition-all"
									style={{
										width: `calc(${progressFraction * 100}% - ${progressFraction * 40}px)`,
									}}
								/>
								{STATUS_STEPS.map((step) => {
									const done = order.status >= step.status;
									return (
										<div
											key={step.status}
											className="flex flex-col items-center gap-2 relative z-10"
										>
											<div
												className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
													done
														? "bg-gradient-to-br from-primary-rose to-accent-gold border-primary-rose text-white"
														: "bg-background border-border text-muted-foreground"
												}`}
											>
												{done ? (
													<CheckCircle2 className="w-5 h-5" />
												) : (
													<span className="text-xs font-bold">
														{step.status}
													</span>
												)}
											</div>
											<span
												className={`text-xs text-center max-w-[60px] ${done ? "font-semibold text-primary-rose" : "text-muted-foreground"}`}
											>
												{step.label}
											</span>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Tracking code (shipped orders) */}
			{order.status === 3 && order.trackingCode && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15 }}
				>
					<Card className="border-blue-500/40 bg-blue-500/5">
						<CardContent className="p-4 flex items-center gap-3">
							<Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
							<div>
								<p className="font-semibold text-blue-700 dark:text-blue-400">
									سفارش شما ارسال شد
								</p>
								<p className="text-sm text-muted-foreground">
									کد پیگیری پستی: <span className="font-mono font-bold text-foreground">{order.trackingCode}</span>
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Pay now banner (pending orders) */}
			{order.status === 1 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15 }}
				>
					<Card className="border-amber-500/40 bg-amber-500/5">
						<CardContent className="p-4 flex items-center justify-between gap-4">
							<div>
								<p className="font-semibold text-amber-700 dark:text-amber-400">
									این سفارش هنوز پرداخت نشده
								</p>
								<p className="text-sm text-muted-foreground">
									برای تکمیل سفارش، یکی از روش‌های پرداخت زیر
									را انتخاب کنید
								</p>
							</div>
							<div className="flex gap-2 flex-shrink-0">
								<Button
									variant="outline"
									size="sm"
									className="gap-1"
									onClick={handlePayWallet}
									disabled={paying}
								>
									<Wallet className="w-4 h-4" />
									کیف پول
								</Button>
								<Button
									variant="luxury"
									size="sm"
									className="gap-1"
									onClick={handlePayGateway}
									disabled={paying}
								>
									<CreditCard className="w-4 h-4" />
									پرداخت آنلاین
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			<div className="grid md:grid-cols-3 gap-6">
				{/* Items */}
				<motion.div
					className="md:col-span-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card>
						<div className="bg-gradient-to-r from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
							<h2 className="font-bold flex items-center gap-2">
								<Package className="w-4 h-4" />
								محصولات (
								{new Intl.NumberFormat("fa-IR").format(
									order.items?.length ?? 0,
								)}
								)
							</h2>
						</div>
						<CardContent className="p-0">
							{order.items?.map((item) => (
								<>
									<div
										key={item.id}
										className="border-b last:border-b-0"
									>
										<div className="flex items-center gap-4 p-4">
											<div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 flex items-center justify-center">
												{item.product?.productPic ? (
													<img
														src={
															item.product
																.productPic
														}
														alt={item.product.name}
														className="w-full h-full object-cover"
													/>
												) : (
													<Package className="w-7 h-7 text-muted-foreground" />
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-medium truncate">
													{item.product?.name}
												</p>
												{item.product?.brand && (
													<p className="text-sm text-muted-foreground">
														{
															item.product.brand
																.name
														}
													</p>
												)}
												<p className="text-sm text-muted-foreground">
													{new Intl.NumberFormat(
														"fa-IR",
													).format(item.count)}{" "}
													عدد ×{" "}
													{formatPrice(
														item.priceSnapshot,
													)}{" "}
													ریال
												</p>
											</div>
											<div className="text-left">
												<p className="font-bold gradient-text">
													{formatPrice(
														item.priceSnapshot *
															item.count,
													)}
												</p>
												{order.status === 3 && (
													<Button
														variant="ghost"
														size="sm"
														className="mt-2 text-xs gap-1 text-muted-foreground hover:text-primary-rose"
														onClick={() => {
															setReturningItemID(
																returningItemID ===
																	item.id
																	? null
																	: item.id,
															);
															setReturnReason("");
															setReturnQty(1);
														}}
													>
														<RotateCcw className="w-3 h-3" />
														مرجوعی
													</Button>
												)}
											</div>
										</div>
									</div>
									{returningItemID === item.id && (
										<div className="px-4 pb-4 space-y-2">
											<textarea
												className="w-full p-2 border rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary-rose/50"
												rows={2}
												placeholder="دلیل مرجوعی را بنویسید..."
												value={returnReason}
												onChange={(e) =>
													setReturnReason(
														e.target.value,
													)
												}
											/>
											<div className="flex items-center gap-3">
												<input
													type="number"
													min={1}
													max={item.count}
													value={returnQty}
													onChange={(e) =>
														setReturnQty(
															Number(
																e.target.value,
															),
														)
													}
													className="w-20 p-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary-rose/50"
												/>
												<span className="text-sm text-muted-foreground">
													عدد
												</span>
												<Button
													size="sm"
													variant="luxury"
													disabled={submittingReturn}
													onClick={() =>
														handleRequestReturn(
															item.id,
														)
													}
												>
													{submittingReturn
														? "در حال ثبت..."
														: "ثبت درخواست"}
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														setReturningItemID(null)
													}
												>
													انصراف
												</Button>
											</div>
										</div>
									)}
								</>
							))}
						</CardContent>
					</Card>
				</motion.div>

				{/* Summary */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.25 }}
					className="space-y-4"
				>
					<Card>
						<CardContent className="p-4 space-y-3">
							<h2 className="font-bold">خلاصه سفارش</h2>
							<Separator />
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">
									روش پرداخت
								</span>
								<span>
									{PAYMENT_METHOD_MAP[order.paymentMethod] ??
										"—"}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">
									هزینه ارسال
								</span>
								<span>
									{order.shippingCost > 0
										? `${formatPrice(order.shippingCost)} ریال`
										: "رایگان"}
								</span>
							</div>
							{order.refundFlag && (
								<div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg text-sm text-red-600">
									<XCircle className="w-4 h-4" />
									درخواست استرداد وجه
								</div>
							)}
							<Separator />
							<div className="flex justify-between font-bold">
								<span>جمع کل</span>
								<span className="gradient-text">
									{formatPrice(order.totalAmount)} ریال
								</span>
							</div>
						</CardContent>
					</Card>

					{/* Status history */}
					{order.statusHistory && order.statusHistory.length > 0 && (
						<Card>
							<CardContent className="p-4 space-y-3">
								<h2 className="font-bold text-sm">
									تاریخچه وضعیت
								</h2>
								<div className="space-y-2">
									{order.statusHistory.map((h, i) => {
										const s = STATUS_MAP[h.status];
										return (
											<div
												key={i}
												className="flex items-start gap-2"
											>
												<div
													className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${s?.color ?? "bg-muted"}`}
												/>
												<div>
													<p className="text-xs font-medium">
														{s?.label ?? "—"}
													</p>
													{h.note && (
														<p className="text-xs text-muted-foreground">
															{h.note}
														</p>
													)}
													<p className="text-xs text-muted-foreground">
														{formatDate(
															h.createdAt,
														)}
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Instalments */}
					{instalments && instalments.length > 0 && (
						<Card>
							<CardContent className="p-4 space-y-3">
								<h2 className="font-bold text-sm flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									اقساط (
									{new Intl.NumberFormat("fa-IR").format(
										instalments.length,
									)}
									)
								</h2>
								<div className="space-y-2">
									{instalments.map((inst, i) => {
										const status =
											INSTALMENT_STATUS_MAP[inst.status];
										return (
											<div
												key={i}
												className="p-2 border rounded-lg space-y-1"
											>
												<div className="flex items-center justify-between">
													<span className="text-xs font-semibold">
														قسط{" "}
														{new Intl.NumberFormat(
															"fa-IR",
														).format(inst.number)}
													</span>
													<span
														className={`text-xs font-medium ${status?.color}`}
													>
														{status?.label ?? "—"}
													</span>
												</div>
												<div className="flex items-center justify-between text-xs text-muted-foreground">
													<span>
														مبلغ:{" "}
														{formatPrice(
															inst.amount,
														)}{" "}
														ریال
													</span>
													<span>
														تاریخ سررسید:{" "}
														{formatDate(
															inst.dueDate,
														)}
													</span>
												</div>
												{inst.paidAt && (
													<p className="text-xs text-green-600">
														پرداخت شده:{" "}
														{formatDate(
															inst.paidAt,
														)}
													</p>
												)}
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					)}
				</motion.div>
			</div>
		</div>
	);
}

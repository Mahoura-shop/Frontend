"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
	ArrowRight,
	AlertCircle,
	CreditCard,
	Truck,
	User,
	ReceiptText,
	Loader2,
	Clock,
	CheckCircle2,
	XCircle,
	PackageX,
	Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { formatPrice } from "@/utils/formatPrice"
import { getAdminOrderDetail, updateOrderStatus, cancelOrder, flagOrderRefund, getOrderInstalments } from "@/services/orderService"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"

interface Instalment {
	id: number
	number: number
	amount: number
	dueDate: string
	status: number
	paidAt: string | null
}

const INSTALMENT_STATUS_MAP: Record<number, { label: string; color: string }> = {
	1: { label: "در انتظار", color: "text-amber-600" },
	2: { label: "پرداخت شده", color: "text-green-600" },
	3: { label: "سررسید گذشته", color: "text-red-600" },
}

interface OrderDetail {
	id: number
	status: number
	paymentMethod: number
	totalAmount: number
	shippingCost: number
	refundFlag: boolean
	createdAt: string
	items: { id: number; count: number; priceSnapshot: number; product: { id: number; name: string; productPic: string } }[]
	user?: { id: number; phone: string; type: number }
}

const STATUS_MAP: Record<number, { label: string; color: string; icon: React.ElementType; nextStates: number[] }> = {
	1: { label: "در انتظار پرداخت", color: "from-amber-500 to-amber-600", icon: Clock, nextStates: [2, 5] },
	2: { label: "پرداخت شده", color: "from-blue-500 to-blue-600", icon: CreditCard, nextStates: [3, 5] },
	3: { label: "ارسال شده", color: "from-purple-500 to-purple-600", icon: Truck, nextStates: [4, 5] },
	4: { label: "تحویل داده شده", color: "from-green-500 to-green-600", icon: CheckCircle2, nextStates: [] },
	5: { label: "لغو شده", color: "from-gray-400 to-gray-500", icon: XCircle, nextStates: [] },
}

const PAYMENT_METHOD_MAP: Record<number, string> = {
	1: "نقدی",
	2: "اقساطی",
	3: "آنلاین",
	4: "کیف پول",
}

const NEXT_STATUS_LABELS: Record<number, string> = {
	2: "تایید پرداخت",
	3: "ارسال سفارش",
	4: "تایید تحویل",
	5: "لغو سفارش",
}

export default function AdminOrderDetailPage() {
	const params = useParams()
	const router = useRouter()
	const orderID = Number(params.orderID)
	const [order, setOrder] = useState<OrderDetail | null | undefined>(undefined)
	const [instalments, setInstalments] = useState<Instalment[]>([])
	const [updating, setUpdating] = useState(false)
	const [statusNote, setStatusNote] = useState("")

	const loadOrder = () =>
		getAdminOrderDetail(orderID)
			.then((res) => setOrder(res?.data ?? null))
			.catch(() => setOrder(null))

	useEffect(() => {
		loadOrder()
		getOrderInstalments(orderID)
			.then((res) => setInstalments(res?.data ?? []))
			.catch(() => setInstalments([]))
	}, [orderID])

	const handleStatusChange = async (newStatus: number) => {
		if (!order) return
		setUpdating(true)
		try {
			await updateOrderStatus(order.id, { status: newStatus, note: statusNote })
			setStatusNote("")
			await loadOrder()
			CustomToast("وضعیت سفارش بروز شد", "success")
		} catch {
			CustomToast("خطا در بروزرسانی وضعیت", "error")
		} finally {
			setUpdating(false)
		}
	}

	const handleCancel = async () => {
		if (!order) return
		setUpdating(true)
		try {
			await cancelOrder(order.id)
			await loadOrder()
			CustomToast("سفارش لغو شد", "success")
		} catch {
			CustomToast("خطا در لغو سفارش", "error")
		} finally {
			setUpdating(false)
		}
	}

	const handleFlagRefund = async () => {
		if (!order) return
		setUpdating(true)
		try {
			await flagOrderRefund(order.id)
			await loadOrder()
			CustomToast("سفارش برای استرجاع علامت‌گذاری شد", "success")
		} catch {
			CustomToast("خطا در علامت‌گذاری استرجاع", "error")
		} finally {
			setUpdating(false)
		}
	}

	if (order === undefined) {
		return (
			<main className="p-6">
				<p className="text-muted-foreground">در حال بارگذاری...</p>
			</main>
		)
	}

	if (order === null) {
		return (
			<main className="p-6">
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
					<AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
					<p className="text-muted-foreground">سفارش یافت نشد</p>
				</motion.div>
			</main>
		)
	}

	const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP[1]
	const StatusIcon = statusInfo.icon
	const nextStates = statusInfo.nextStates

	const statCards = [
		{
			title: "وضعیت",
			value: statusInfo.label,
			icon: StatusIcon,
			color: statusInfo.color,
		},
		{
			title: "مبلغ کل",
			value: `${formatPrice(order.totalAmount)} تومان`,
			icon: ReceiptText,
			color: "from-primary-rose to-secondary-plum",
		},
		{
			title: "هزینه ارسال",
			value: `${formatPrice(order.shippingCost)} تومان`,
			icon: Truck,
			color: "from-blue-500 to-blue-600",
		},
		{
			title: "مشتری",
			value: order.user?.phone ?? "—",
			icon: User,
			color: "from-purple-500 to-purple-600",
		},
	]

	return (
		<main className="p-6">
			<div className="mb-8">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => router.push("/admin/orders")}
					className="gap-2 mb-4 text-muted-foreground hover:text-foreground"
				>
					<ArrowRight className="w-4 h-4" />
					بازگشت به سفارش‌ها
				</Button>
				<h1 className="text-3xl font-bold mb-1">
					سفارش #{new Intl.NumberFormat("fa-IR").format(order.id)}
				</h1>
				<p className="text-muted-foreground text-sm flex items-center gap-3">
					{new Date(order.createdAt).toLocaleDateString("fa-IR")}
					{" · "}
					{PAYMENT_METHOD_MAP[order.paymentMethod] ?? "—"}
					{order.refundFlag && (
						<Badge variant="destructive" className="text-xs">درخواست استرجاع</Badge>
					)}
				</p>
			</div>

			{/* Stat Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{statCards.map((stat, i) => (
					<motion.div
						key={stat.title}
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ delay: i * 0.08, type: "spring" }}
						whileHover={{ y: -6, transition: { type: "spring", stiffness: 400 } }}
					>
						<Card className="overflow-hidden relative group">
							<CardHeader className="pb-3">
								<div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
									<stat.icon className="w-5 h-5 text-white" />
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-xs text-muted-foreground mb-1">{stat.title}</p>
								<p className="font-bold text-sm leading-snug">{stat.value}</p>
							</CardContent>
							<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
						</Card>
					</motion.div>
				))}
			</div>

			{/* Items Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.35, type: "spring" }}
				className="mb-6"
			>
				<Card>
					<CardHeader>
						<CardTitle>محصولات سفارش</CardTitle>
						<CardDescription>{order.items.length} قلم</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>محصول</TableHead>
									<TableHead>تعداد</TableHead>
									<TableHead>قیمت واحد</TableHead>
									<TableHead>جمع</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{order.items.map((item, i) => (
									<motion.tr
										key={item.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.4 + i * 0.05 }}
										className="hover:bg-muted/50 border-b"
									>
										<TableCell>
											<div className="flex items-center gap-3">
												{item.product.productPic && (
													<img
														src={item.product.productPic}
														alt={item.product.name}
														className="w-10 h-10 rounded object-cover flex-shrink-0"
													/>
												)}
												<span className="font-medium">{item.product.name}</span>
											</div>
										</TableCell>
										<TableCell>{item.count}</TableCell>
										<TableCell className="text-muted-foreground">
											{formatPrice(item.priceSnapshot)} تومان
										</TableCell>
										<TableCell className="font-bold text-primary-rose">
											{formatPrice(item.count * item.priceSnapshot)} تومان
										</TableCell>
									</motion.tr>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</motion.div>

			{/* Instalments */}
			{instalments.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.42, type: "spring" }}
					className="mb-6"
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="w-5 h-5" />
								اقساط ({new Intl.NumberFormat("fa-IR").format(instalments.length)})
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>شماره قسط</TableHead>
										<TableHead>مبلغ</TableHead>
										<TableHead>تاریخ سررسید</TableHead>
										<TableHead>وضعیت</TableHead>
										<TableHead>تاریخ پرداخت</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{instalments.map((inst) => {
										const s = INSTALMENT_STATUS_MAP[inst.status]
										return (
											<TableRow key={inst.id}>
												<TableCell className="font-medium">
													{new Intl.NumberFormat("fa-IR").format(inst.number)}
												</TableCell>
												<TableCell>{formatPrice(inst.amount)} تومان</TableCell>
												<TableCell className="text-muted-foreground">
													{new Date(inst.dueDate).toLocaleDateString("fa-IR")}
												</TableCell>
												<TableCell>
													<span className={`text-sm font-medium ${s?.color ?? ""}`}>
														{s?.label ?? "—"}
													</span>
												</TableCell>
												<TableCell className="text-muted-foreground">
													{inst.paidAt
														? new Date(inst.paidAt).toLocaleDateString("fa-IR")
														: "—"}
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Status Change */}
			{nextStates.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, type: "spring" }}
					className="mb-6"
				>
					<Card>
						<CardHeader>
							<CardTitle>تغییر وضعیت</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<textarea
								value={statusNote}
								onChange={(e) => setStatusNote(e.target.value)}
								placeholder="یادداشت (اختیاری)"
								className="w-full p-3 border rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary-rose/50"
								rows={2}
							/>
							<div className="flex gap-2 flex-wrap">
								{nextStates
									.filter((s) => s !== 5)
									.map((nextStatus) => (
										<Button
											key={nextStatus}
											onClick={() => handleStatusChange(nextStatus)}
											disabled={updating}
											className="gap-2"
										>
											{updating && <Loader2 className="w-4 h-4 animate-spin" />}
											{NEXT_STATUS_LABELS[nextStatus] ?? STATUS_MAP[nextStatus]?.label}
										</Button>
									))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Danger Actions */}
			{(order.status !== 5 || !order.refundFlag) && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.58, type: "spring" }}
				>
					<Card className="border-destructive/20">
						<CardHeader>
							<CardTitle className="text-destructive">اقدامات</CardTitle>
						</CardHeader>
						<CardContent className="flex gap-3 flex-wrap">
							{order.status !== 5 && (
								<Button
									variant="destructive"
									onClick={handleCancel}
									disabled={updating}
									className="gap-2"
								>
									{updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageX className="w-4 h-4" />}
									لغو سفارش
								</Button>
							)}
							{!order.refundFlag && order.status !== 5 && (
								<Button
									variant="outline"
									onClick={handleFlagRefund}
									disabled={updating}
									className="gap-2 border-amber-400 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
								>
									{updating && <Loader2 className="w-4 h-4 animate-spin" />}
									علامت‌گذاری برای استرجاع
								</Button>
							)}
						</CardContent>
					</Card>
				</motion.div>
			)}
		</main>
	)
}

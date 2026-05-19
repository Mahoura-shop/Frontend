"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, ChevronLeft, Clock, CreditCard, Truck, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
import { formatDate } from "@/utils/formatDate"
import { getAllOrders } from "@/services/orderService"
import PermissionGuard from "@/components/admin/PermissionGuard"

interface Order {
	id: number
	status: number
	paymentMethod: number
	totalAmount: number
	shippingCost: number
	refundFlag: boolean
	createdAt: string
	items: { count: number; priceSnapshot: number; product: { name: string } }[]
	user?: { phone: string; type: number }
}

const STATUS_MAP: Record<number, { label: string; variant: "available" | "new" | "outOfStock" | "default" | "secondary"; icon: React.ElementType }> = {
	1: { label: "در انتظار پرداخت", variant: "outOfStock", icon: Clock },
	2: { label: "پرداخت شده", variant: "new", icon: CreditCard },
	3: { label: "ارسال شده", variant: "new", icon: Truck },
	5: { label: "لغو شده", variant: "secondary", icon: XCircle },
}

const PAYMENT_METHOD_MAP: Record<number, string> = {
	1: "نقدی",
	2: "اقساطی",
	3: "آنلاین",
	4: "کیف پول",
}

const STATUS_FILTER_OPTIONS = [
	{ value: "", label: "همه" },
	{ value: "pending", label: "در انتظار" },
	{ value: "paid", label: "پرداخت شده" },
	{ value: "shipped", label: "ارسال شده" },
	{ value: "cancelled", label: "لغو شده" },
]

function AdminOrdersPageContent() {
	const [orders, setOrders] = useState<Order[] | null>(null)
	const [statusFilter, setStatusFilter] = useState("")

	useEffect(() => {
		setOrders(null)
		getAllOrders(statusFilter || undefined)
			.then((res) => setOrders(res?.data ?? []))
			.catch(() => setOrders([]))
	}, [statusFilter])

	return (
		<main className="p-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">مدیریت سفارش‌ها</h1>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">
						مجموع:{" "}
						<span className="font-bold text-foreground">{orders?.length ?? "—"}</span>
					</span>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4">
				<div className="flex gap-2 flex-wrap">
					{STATUS_FILTER_OPTIONS.map((option) => (
						<Button
							key={option.value}
							variant={statusFilter === option.value ? "default" : "outline"}
							size="sm"
							onClick={() => setStatusFilter(option.value)}
							className="text-xs"
						>
							{option.label}
						</Button>
					))}
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>شماره سفارش</TableHead>
								<TableHead>مشتری</TableHead>
								<TableHead>وضعیت</TableHead>
								<TableHead>روش پرداخت</TableHead>
								<TableHead>محصولات</TableHead>
								<TableHead>مبلغ کل</TableHead>
								<TableHead>تاریخ</TableHead>
								<TableHead className="text-center">عملیات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders === null && (
								Array.from({ length: 7 }).map((_, i) => (
									<TableRow key={i}>
										<TableCell><Skeleton className="h-4 w-16" /></TableCell>
										<TableCell><Skeleton className="h-4 w-24" /></TableCell>
										<TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
										<TableCell><Skeleton className="h-4 w-16" /></TableCell>
										<TableCell><Skeleton className="h-4 w-12" /></TableCell>
										<TableCell><Skeleton className="h-4 w-24" /></TableCell>
										<TableCell><Skeleton className="h-4 w-20" /></TableCell>
										<TableCell className="text-center"><Skeleton className="h-8 w-16 rounded-md mx-auto" /></TableCell>
									</TableRow>
								))
							)}
							{orders?.length === 0 && (
								<TableRow>
									<TableCell colSpan={8} className="text-center py-12">
										<div className="flex flex-col items-center gap-2 text-muted-foreground">
											<ShoppingBag className="w-10 h-10" />
											<span>سفارشی یافت نشد</span>
										</div>
									</TableCell>
								</TableRow>
							)}
							{orders?.map((order, i) => {
								const status = STATUS_MAP[order.status] ?? STATUS_MAP[1]
								const StatusIcon = status.icon
								const itemCount = order.items?.reduce((s, item) => s + item.count, 0) ?? 0

								return (
									<motion.tr
										key={order.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: i * 0.04 }}
										className="group hover:bg-muted/50 border-b"
									>
										<TableCell className="font-medium">
											#{new Intl.NumberFormat("fa-IR").format(order.id)}
											{order.refundFlag && (
												<Badge variant="destructive" className="text-xs mr-2">
													استرجاع
												</Badge>
											)}
										</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											{order.user?.phone ?? "—"}
										</TableCell>
										<TableCell>
											<Badge variant={status.variant} className="text-xs gap-1">
												<StatusIcon className="w-3 h-3" />
												{status.label}
											</Badge>
										</TableCell>
										<TableCell className="text-sm">
											{PAYMENT_METHOD_MAP[order.paymentMethod] ?? "—"}
										</TableCell>
										<TableCell className="text-sm">{itemCount} عدد</TableCell>
										<TableCell className="font-bold text-primary-rose">
											{formatPrice(order.totalAmount)}
										</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											{formatDate(order.createdAt)}
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center">
												<Link href={`/admin/orders/${order.id}`}>
													<Button variant="outline" size="sm" className="gap-1 text-xs">
														جزئیات
														<ChevronLeft className="w-3 h-3" />
													</Button>
												</Link>
											</div>
										</TableCell>
									</motion.tr>
								)
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</main>
	)
}

export default function AdminOrdersPage() {
	return (
		<PermissionGuard permission="order:see">
			<AdminOrdersPageContent />
		</PermissionGuard>
	)
}

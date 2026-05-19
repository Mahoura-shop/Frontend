"use client"

import { useEffect, useState, useCallback } from "react"
import { usePullToRefresh } from "@/hooks/usePullToRefresh"
import { RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import {
	Package,
	ShoppingBag,
	Clock,
	CheckCircle2,
	Truck,
	XCircle,
	CreditCard,
	ChevronLeft,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/utils/formatPrice"
import { formatDate } from "@/utils/formatDate"
import { getMyOrders } from "@/services/orderService"

interface Order {
	id: number
	status: number
	paymentMethod: number
	totalAmount: number
	shippingCost: number
	refundFlag: boolean
	createdAt: string
	items: { id: number; count: number; priceSnapshot: number; product: { name: string; productPic: string } }[]
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

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)

	const fetchOrders = useCallback(async () => {
		try {
			const res = await getMyOrders()
			setOrders(res?.data ?? [])
		} catch {
			setOrders([])
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => { fetchOrders() }, [fetchOrders])

	const { pulling, pullY, refreshing } = usePullToRefresh(fetchOrders)

	if (loading) {
		return (
			<div className="space-y-4">
				<div>
					<Skeleton className="h-8 w-48 mb-1" />
					<Skeleton className="h-4 w-24" />
				</div>
				<div className="space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="p-4">
								<div className="flex items-center gap-4">
									<Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
									<div className="flex-1 space-y-2">
										<div className="flex items-center gap-2">
											<Skeleton className="h-4 w-28" />
											<Skeleton className="h-5 w-20 rounded-full" />
										</div>
										<Skeleton className="h-3 w-44" />
										<Skeleton className="h-5 w-24" />
									</div>
									<Skeleton className="h-8 w-20 rounded-md flex-shrink-0" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	}

	if (orders.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center py-20"
			>
				<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 rounded-full flex items-center justify-center">
					<ShoppingBag className="w-12 h-12 text-muted-foreground" />
				</div>
				<h2 className="text-2xl font-bold mb-3">هنوز سفارشی ندارید</h2>
				<p className="text-muted-foreground mb-6">اولین سفارش خود را ثبت کنید!</p>
				<Link href="/products">
					<Button variant="luxury" className="gap-2">
						<ShoppingBag className="w-5 h-5" />
						مشاهده محصولات
					</Button>
				</Link>
			</motion.div>
		)
	}

	return (
		<div className="space-y-4">
			{(pulling || refreshing) && (
				<div
					className="fixed top-0 inset-x-0 z-50 flex items-center justify-center pointer-events-none"
					style={{ height: pullY || (refreshing ? 56 : 0), transition: pulling ? "none" : "height 0.3s ease" }}
				>
					<div className="flex items-center gap-2 bg-background/90 backdrop-blur border border-border rounded-full px-4 py-2 shadow-lg text-sm text-muted-foreground">
						<RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} style={!refreshing ? { transform: `rotate(${(pullY / 56) * 180}deg)` } : undefined} />
						{refreshing ? "در حال بارگذاری..." : "رها کنید"}
					</div>
				</div>
			)}
			<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
				<h1 className="text-2xl font-bold gradient-text mb-1">سفارش‌های من</h1>
				<p className="text-sm text-muted-foreground">
					{new Intl.NumberFormat("fa-IR").format(orders.length)} سفارش
				</p>
			</motion.div>

			<div className="space-y-3">
				{orders.map((order, index) => {
					const status = STATUS_MAP[order.status] ?? STATUS_MAP[1]
					const StatusIcon = status.icon
					const firstItem = order.items?.[0]
					const itemCount = order.items?.reduce((s, i) => s + i.count, 0) ?? 0

					return (
						<motion.div
							key={order.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
						>
							<Card className="hover:shadow-md transition-shadow">
								<CardContent className="p-4">
									<div className="flex items-center gap-4">
										{/* Product thumbnail */}
										<div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 flex items-center justify-center">
											{firstItem?.product?.productPic ? (
												<img
													src={firstItem.product.productPic}
													alt={firstItem.product.name}
													className="w-full h-full object-cover"
												/>
											) : (
												<Package className="w-8 h-8 text-muted-foreground" />
											)}
										</div>

										{/* Details */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<p className="font-semibold">
													سفارش #{new Intl.NumberFormat("fa-IR").format(order.id)}
												</p>
												<Badge variant={status.variant} className="text-xs">
													{status.label}
												</Badge>
											</div>
											<p className="text-sm text-muted-foreground mb-1">
												{formatDate(order.createdAt)} •{" "}
												{new Intl.NumberFormat("fa-IR").format(itemCount)} محصول •{" "}
												{PAYMENT_METHOD_MAP[order.paymentMethod] ?? "—"}
											</p>
											<p className="text-lg font-bold gradient-text">
												{formatPrice(order.totalAmount)} ریال
											</p>
										</div>

										{/* Status icon + detail link */}
										<div className="flex items-center gap-3 flex-shrink-0">
											<StatusIcon className="w-5 h-5 text-muted-foreground" />
											<Link href={`/dashboard/orders/${order.id}`}>
												<Button variant="outline" size="sm" className="gap-1">
													جزئیات
													<ChevronLeft className="w-3 h-3" />
												</Button>
											</Link>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

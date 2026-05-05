"use client"

import { motion } from "framer-motion"
import { XCircle, ShoppingBag, Package, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PaymentFailurePage() {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				className="text-center max-w-md mx-auto p-8"
			>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
					className="w-24 h-24 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center"
				>
					<XCircle className="w-12 h-12 text-red-600" />
				</motion.div>
				<h2 className="text-2xl font-bold text-destructive mb-3">پرداخت لغو شد</h2>
				<p className="text-muted-foreground mb-8">
					پرداخت شما لغو شد یا با خطا مواجه شد. سفارش شما در وضعیت «در انتظار پرداخت» باقی مانده — می‌توانید بعداً از سفارش‌های خود آن را پرداخت کنید.
				</p>
				<div className="flex gap-3 justify-center">
					<Link href="/dashboard/orders">
						<Button variant="outline" className="gap-2">
							<Package className="w-4 h-4" />
							سفارش‌های من
						</Button>
					</Link>
					<Link href="/cart">
						<Button variant="luxury" className="gap-2">
							<RefreshCw className="w-4 h-4" />
							تلاش مجدد
						</Button>
					</Link>
				</div>
			</motion.div>
		</div>
	)
}

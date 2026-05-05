"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, ShoppingBag, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getData } from "@/services/services"

export default function PaymentSuccessPage() {
	const searchParams = useSearchParams()
	const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")

	useEffect(() => {
		const authority = searchParams.get("Authority")
		const gatewayStatus = searchParams.get("Status")

		if (!authority) {
			setStatus("success")
			return
		}

		getData({ endPoint: `v1/order/pay/verify?Authority=${authority}&Status=${gatewayStatus}` })
			.then(() => setStatus("success"))
			.catch(() => setStatus("failed"))
	}, [searchParams])

	if (status === "loading") {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
					className="w-10 h-10 border-4 border-primary-rose border-t-transparent rounded-full"
				/>
			</div>
		)
	}

	if (status === "failed") {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center max-w-md mx-auto p-8"
				>
					<div className="w-24 h-24 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
						<Package className="w-12 h-12 text-red-600" />
					</div>
					<h2 className="text-2xl font-bold text-destructive mb-3">پرداخت ناموفق</h2>
					<p className="text-muted-foreground mb-6">
						تأیید پرداخت با خطا مواجه شد. اگر مبلغ کسر شده، ظرف ۷۲ ساعت بازگشت می‌یابد.
					</p>
					<div className="flex gap-3 justify-center">
						<Link href="/dashboard/orders">
							<Button variant="outline">سفارش‌های من</Button>
						</Link>
						<Link href="/products">
							<Button variant="luxury" className="gap-2">
								<ShoppingBag className="w-4 h-4" />
								ادامه خرید
							</Button>
						</Link>
					</div>
				</motion.div>
			</div>
		)
	}

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
					className="w-24 h-24 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center"
				>
					<CheckCircle2 className="w-12 h-12 text-green-600" />
				</motion.div>
				<h2 className="text-3xl font-bold gradient-text mb-3">پرداخت موفق!</h2>
				<p className="text-muted-foreground mb-8">
					سفارش شما با موفقیت ثبت و پرداخت شد. می‌توانید وضعیت سفارش را در داشبورد دنبال کنید.
				</p>
				<div className="flex gap-3 justify-center">
					<Link href="/dashboard/orders">
						<Button variant="outline" className="gap-2">
							<Package className="w-4 h-4" />
							پیگیری سفارش
						</Button>
					</Link>
					<Link href="/products">
						<Button variant="luxury" className="gap-2">
							<ShoppingBag className="w-4 h-4" />
							ادامه خرید
						</Button>
					</Link>
				</div>
			</motion.div>
		</div>
	)
}

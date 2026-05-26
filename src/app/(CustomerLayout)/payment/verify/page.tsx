"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { verifyPayment } from "@/services/orderService"

export default function PaymentVerifyPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
	const [message, setMessage] = useState("")

	useEffect(() => {
		const authority = searchParams.get("Authority")
		const zarinpalStatus = searchParams.get("Status")

		if (!authority || !zarinpalStatus) {
			setStatus("failed")
			setMessage("اطلاعات پرداخت ناقص است")
			return
		}

		verifyPayment(authority, zarinpalStatus)
			.then(() => {
				setStatus("success")
				setMessage("پرداخت با موفقیت تایید شد")
			})
			.catch(() => {
				setStatus("failed")
				setMessage("پرداخت تایید نشد یا لغو شد")
			})
	}, [searchParams])

	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="text-center max-w-md mx-auto p-8">
				{status === "loading" && (
					<div>
						<div className="w-12 h-12 border-4 border-primary-rose border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-foreground">در حال تایید پرداخت...</p>
					</div>
				)}

				{status === "success" && (
					<div>
						<div className="w-20 h-20 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
							<svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h2 className="text-xl font-bold text-foreground mb-2">{message}</h2>
						<button
							onClick={() => router.push("/dashboard/orders")}
							className="mt-4 px-6 py-2 bg-primary-rose text-white rounded-lg"
						>
							مشاهده سفارشات
						</button>
					</div>
				)}

				{status === "failed" && (
					<div>
						<div className="w-20 h-20 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
							<svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
						<h2 className="text-xl font-bold text-foreground mb-2">{message}</h2>
						<button
							onClick={() => router.push("/dashboard/orders")}
							className="mt-4 px-6 py-2 bg-primary-rose text-white rounded-lg"
						>
							بازگشت به سفارشات
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

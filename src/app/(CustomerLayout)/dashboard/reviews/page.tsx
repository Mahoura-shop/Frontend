"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Star, MessageSquare, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getData } from "@/services/services"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import { Skeleton } from "@/components/ui/skeleton"

interface MyReview {
	id: number
	productID: number
	productName: string
	productSlug: string
	productPic: string
	rating: number
	comment: string
	isVerified: boolean
	createdAt: string
}

export default function ReviewsPage() {
	const [reviews, setReviews] = useState<MyReview[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getData({ endPoint: "v1/reviews" })
			.then((data) => setReviews(data?.data ?? []))
			.catch(() => CustomToast("خطا در دریافت نظرات", "error"))
			.finally(() => setLoading(false))
	}, [])

	return (
		<div className="space-y-4">
			<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
				<h1 className="text-2xl font-bold gradient-text mb-1">نظرات من</h1>
				<p className="text-sm text-muted-foreground">نظراتی که برای محصولات ثبت کرده‌اید</p>
			</motion.div>

			{loading && (
				<div className="space-y-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="rounded-2xl border bg-card p-5">
							<div className="flex gap-4">
								<Skeleton className="w-14 h-14 rounded-xl shrink-0" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-1/3" />
									<Skeleton className="h-3 w-1/4" />
									<Skeleton className="h-3 w-2/3" />
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{!loading && reviews.length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="text-center py-20"
				>
					<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
						<Star className="w-12 h-12 text-amber-500" />
					</div>
					<h2 className="text-xl font-bold mb-3">هنوز نظری ثبت نکرده‌اید</h2>
					<p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
						برای ثبت نظر، محصول را خریداری کنید و از صفحه محصول نظر خود را ارسال کنید
					</p>
					<Link href="/products">
						<Button variant="luxury" className="gap-2">
							<MessageSquare className="w-5 h-5" />
							مشاهده محصولات
						</Button>
					</Link>
				</motion.div>
			)}

			{!loading && reviews.length > 0 && (
				<div className="space-y-3">
					{reviews.map((review, i) => (
						<motion.div
							key={review.id}
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05 }}
							className="rounded-2xl border bg-card p-5"
						>
							<div className="flex gap-4">
								{review.productPic ? (
									<img
										src={review.productPic}
										alt={review.productName}
										className="w-14 h-14 rounded-xl object-cover shrink-0"
									/>
								) : (
									<div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
										<Package className="w-6 h-6 text-muted-foreground" />
									</div>
								)}

								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-2 mb-1">
										<Link
											href={`/products/${review.productSlug}`}
											className="font-medium text-sm hover:text-primary-rose transition-colors truncate"
										>
											{review.productName || "محصول"}
										</Link>
										<span className="text-xs text-muted-foreground shrink-0">
											{new Date(review.createdAt).toLocaleDateString("fa-IR")}
										</span>
									</div>

									<div className="flex items-center gap-2 mb-2">
										<div className="flex gap-0.5">
											{[1, 2, 3, 4, 5].map((s) => (
												<Star
													key={s}
													className={`w-3.5 h-3.5 ${
														s <= review.rating
															? "fill-amber-400 text-amber-400"
															: "text-muted-foreground/30"
													}`}
												/>
											))}
										</div>
										{review.isVerified && (
											<span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
												خریدار تایید شده
											</span>
										)}
									</div>

									{review.comment && (
										<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
											{review.comment}
										</p>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</div>
			)}
		</div>
	)
}

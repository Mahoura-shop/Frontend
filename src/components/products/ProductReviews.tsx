"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare, Send, BadgeCheck, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Review {
	id: number;
	userFirstName: string;
	userLastName: string;
	rating: number;
	comment: string;
	isVerified: boolean;
	createdAt: string;
}

interface Props {
	reviews: Review[];
	accessToken: string | undefined;
	alreadyReviewed: boolean;
	reviewRating: number;
	hoverRating: number;
	reviewComment: string;
	submittingReview: boolean;
	onRatingChange: (v: number) => void;
	onHoverRating: (v: number) => void;
	onHoverLeave: () => void;
	onCommentChange: (v: string) => void;
	onSubmit: () => void;
}

const RATING_LABELS = ["", "خیلی بد", "بد", "متوسط", "خوب", "عالی"];

export default function ProductReviews({
	reviews, accessToken, alreadyReviewed, reviewRating, hoverRating,
	reviewComment, submittingReview, onRatingChange, onHoverRating, onHoverLeave, onCommentChange, onSubmit,
}: Props) {
	const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

	return (
		<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-16 border-t pt-12">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<MessageSquare className="w-6 h-6 text-primary-rose" />
					<h2 className="text-2xl font-bold">نظرات کاربران</h2>
					{reviews.length > 0 && (
						<span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{reviews.length} نظر</span>
					)}
				</div>
				{reviews.length > 0 && (
					<div className="flex items-center gap-2">
						<span className="text-2xl font-bold text-primary-rose">{avgRating.toFixed(1)}</span>
						<div className="flex gap-0.5">
							{[1, 2, 3, 4, 5].map((s) => (
								<Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
							))}
						</div>
					</div>
				)}
			</div>

			{accessToken && !alreadyReviewed && (
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 rounded-2xl border bg-card p-6 space-y-4">
					<h3 className="font-semibold text-base">ثبت نظر شما</h3>
					<div className="flex items-center gap-1">
						{[1, 2, 3, 4, 5].map((s) => (
							<button key={s} type="button" data-testid={`review-star-${s}`} onClick={() => onRatingChange(s)} onMouseEnter={() => onHoverRating(s)} onMouseLeave={onHoverLeave} className="transition-transform hover:scale-110">
								<Star className={`w-7 h-7 transition-colors ${s <= (hoverRating || reviewRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
							</button>
						))}
						{reviewRating > 0 && <span className="mr-2 text-sm text-muted-foreground">{RATING_LABELS[reviewRating]}</span>}
					</div>
					<textarea
						value={reviewComment}
						onChange={(e) => onCommentChange(e.target.value)}
						placeholder="نظر خود را بنویسید... (اختیاری)"
						rows={4}
						className="w-full rounded-xl border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-rose/40"
						data-testid="review-comment"
					/>
					<Button variant="luxury" className="gap-2" disabled={submittingReview || reviewRating === 0} onClick={onSubmit} data-testid="submit-review">
						{submittingReview ? (
							<motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
						) : (
							<Send className="w-4 h-4" />
						)}
						ثبت نظر
					</Button>
				</motion.div>
			)}

			{!accessToken && (
				<div className="mb-10 rounded-2xl border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
					برای ثبت نظر <Link href="/signin" className="text-primary-rose font-medium hover:underline">وارد شوید</Link>
				</div>
			)}

			{alreadyReviewed && (
				<div className="mb-10 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
					<Check className="w-4 h-4" />
					نظر شما با موفقیت ثبت شد
				</div>
			)}

			{reviews.length === 0 ? (
				<div className="text-center py-16 text-muted-foreground">
					<Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
					<p>هنوز نظری ثبت نشده است</p>
				</div>
			) : (
				<div className="space-y-4">
					{reviews.map((review, i) => (
						<motion.div key={review.id} data-testid={`review-item-${review.id}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border bg-card p-5">
							<div className="flex items-start gap-4">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-rose/30 to-secondary-plum/30 flex items-center justify-center shrink-0 text-sm font-bold text-primary-rose">
									{review.userFirstName ? review.userFirstName.slice(0, 1) : "ک"}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between flex-wrap gap-2 mb-2">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												{review.userFirstName || review.userLastName ? `${review.userFirstName} ${review.userLastName}`.trim() : "کاربر"}
											</span>
											{review.isVerified && (
												<span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
													<BadgeCheck className="w-3 h-3" />
													خریدار تایید شده
												</span>
											)}
										</div>
										<span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("fa-IR")}</span>
									</div>
									<div className="flex gap-0.5 mb-2">
										{[1, 2, 3, 4, 5].map((s) => (
											<Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
										))}
									</div>
									{review.comment && <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>}
								</div>
							</div>
						</motion.div>
					))}
				</div>
			)}
		</motion.div>
	);
}

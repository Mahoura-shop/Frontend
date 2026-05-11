"use client"

import { motion } from "framer-motion"
import { MessageSquare, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ReviewsPage() {
	return (
		<div className="space-y-4">
			<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
				<h1 className="text-2xl font-bold gradient-text mb-1">نظرات من</h1>
				<p className="text-sm text-muted-foreground">نظراتی که برای محصولات ثبت کرده‌اید</p>
			</motion.div>

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
		</div>
	)
}

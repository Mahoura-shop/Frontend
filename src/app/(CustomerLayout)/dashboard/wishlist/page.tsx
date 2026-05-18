"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Trash2, ShoppingCart, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/utils/formatPrice"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import { getWishlist, removeFromWishlist } from "@/services/wishlistService"
import resolvePrice from "@/utils/resolvePrice"
import useUserStore from "@/store/userStore/userStore"

interface WishlistItem {
	id: number
	product: {
		id: number
		name: string
		slug: string
		productPic: string
		step1Price: number
		step2Price: number
		step3Price: number
		step4Price: number
		consumerPrice: number
		irrPrice: number
		quantity: number
	}
}

export default function WishlistPage() {
	const { userType } = useUserStore()
	const [items, setItems] = useState<WishlistItem[] | null>(null)
	const [removing, setRemoving] = useState<number | null>(null)

	useEffect(() => {
		getWishlist()
			.then((res) => setItems(res?.data ?? []))
			.catch(() => setItems([]))
	}, [])

	const handleRemove = async (productID: number) => {
		setRemoving(productID)
		try {
			await removeFromWishlist(productID)
			setItems((prev) => prev?.filter((item) => item.product.id !== productID) ?? prev)
			CustomToast("از علاقه‌مندی‌ها حذف شد", "success")
		} catch {
		} finally {
			setRemoving(null)
		}
	}

	if (items === null) {
		return (
			<div className="space-y-4">
				<h1 className="text-2xl font-bold gradient-text">علاقه‌مندی‌ها</h1>
				<p className="text-muted-foreground text-sm">در حال بارگذاری...</p>
			</div>
		)
	}

	if (items.length === 0) {
		return (
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
				<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
					<Heart className="w-12 h-12 text-red-400" />
				</div>
				<h2 className="text-2xl font-bold mb-3">هنوز محصولی ذخیره نکردید</h2>
				<p className="text-muted-foreground mb-6">محصولات موردعلاقه خود را ذخیره کنید</p>
				<Link href="/products">
					<Button variant="luxury" className="gap-2">
						<Package className="w-5 h-5" />
						مشاهده محصولات
					</Button>
				</Link>
			</motion.div>
		)
	}

	return (
		<div className="space-y-4">
			<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
				<h1 className="text-2xl font-bold gradient-text mb-1">علاقه‌مندی‌ها</h1>
				<p className="text-sm text-muted-foreground">{new Intl.NumberFormat("fa-IR").format(items.length)} محصول</p>
			</motion.div>

			<div className="grid sm:grid-cols-2 gap-4">
				<AnimatePresence mode="popLayout">
					{items.map((item, index) => (
						<motion.div
							key={item.id}
							layout
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ delay: index * 0.05 }}
						>
							<Card className="hover:shadow-md transition-shadow overflow-hidden">
								<CardContent className="p-4">
									<div className="flex gap-4">
										<div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 flex items-center justify-center">
											{item.product.productPic ? (
												<img
													src={item.product.productPic}
													alt={item.product.name}
													className="w-full h-full object-cover"
												/>
											) : (
												<Package className="w-8 h-8 text-muted-foreground" />
											)}
										</div>

										<div className="flex-1 min-w-0">
											<p className="font-semibold truncate mb-1">{item.product.name}</p>
											<p className="text-lg font-bold gradient-text mb-3">
												{formatPrice(resolvePrice(item.product, userType))} ریال
											</p>
											<div className="flex gap-2">
												<Link href={`/products/${item.product.slug}`} className="flex-1">
													<Button size="sm" variant="outline" className="w-full gap-1 text-xs">
														<ShoppingCart className="w-3 h-3" />
														مشاهده محصول
													</Button>
												</Link>
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleRemove(item.product.id)}
													disabled={removing === item.product.id}
													className="gap-1 text-xs border-destructive text-destructive hover:bg-destructive/10"
												>
													<Trash2 className="w-3 h-3" />
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	)
}

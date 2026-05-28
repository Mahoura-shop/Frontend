"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Check, Share2, Copy, Package, Heart, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import resolvePrice from "@/utils/resolvePrice";

interface Props {
	product: Product;
	userType: string | undefined;
	accessToken: string | undefined;
	cartCount: number;
	adding: boolean;
	wishlisted: boolean;
	wishlistLoading: boolean;
	addToCartRef: React.RefObject<HTMLDivElement>;
	formatPrice: (n: number) => string;
	onAddToCart: () => void;
	onRemoveFromCart: () => void;
	onToggleWishlist: () => void;
}

export default function ProductInfo({
	product, userType, accessToken, cartCount, adding, wishlisted, wishlistLoading,
	addToCartRef, formatPrice, onAddToCart, onRemoveFromCart, onToggleWishlist,
}: Props) {
	const price = resolvePrice(product, userType);
	const isShopkeeper = userType === "shopkeeper" || userType === "shopkeeperCash" || userType === "shopkeeperCheque";

	return (
		<motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
			{/* Header */}
			<div className="flex justify-between pb-4 border-b">
				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground mb-2">{product?.brand?.name}</p>
					<h1 className="text-4xl font-bold mb-2">{product.name}</h1>
					{product.slug && <p className="text-lg text-muted-foreground">{product?.category?.name}</p>}
					{(product.reviewCount ?? 0) > 0 && (
						<div className="flex items-center gap-2 mt-2">
							<div className="flex gap-0.5">
								{[1, 2, 3, 4, 5].map((s) => (
									<Star key={s} className={`w-4 h-4 ${s <= Math.round(product.averageRating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
								))}
							</div>
							<span className="text-sm font-medium text-amber-500">{(product.averageRating ?? 0).toFixed(1)}</span>
							<span className="text-xs text-muted-foreground">({product.reviewCount} نظر)</span>
						</div>
					)}
				</div>
				<div className="flex gap-2">
					{accessToken && (
						<Button variant="outline" size="icon" className="w-12 h-12" onClick={onToggleWishlist} disabled={wishlistLoading}>
							<Heart className={`w-5 h-5 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
						</Button>
					)}
					<Button variant="outline" size="icon" className="w-12 h-12" onClick={() => { navigator.clipboard.writeText(window.location.href); CustomToast("لینک کپی شد", "success"); }}>
						<Copy className="w-5 h-5" />
					</Button>
					{typeof navigator !== "undefined" && "share" in navigator && (
						<Button variant="outline" size="icon" className="w-12 h-12" onClick={async () => {
							try { await navigator.share({ title: product.name, text: `${product.name} را در ماهورا ببینید:`, url: window.location.href }); }
							catch (e: any) { if (e?.name !== "AbortError") { navigator.clipboard.writeText(window.location.href); CustomToast("لینک کپی شد", "success"); } }
						}}>
							<Share2 className="w-5 h-5" />
						</Button>
					)}
				</div>
			</div>

			{/* Price */}
			<div className="py-6 border-b space-y-4">
				<div className="flex items-baseline gap-3">
					<motion.span className="text-5xl font-bold text-primary-rose" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
						{formatPrice(price)}
					</motion.span>
					<span className="text-2xl text-muted-foreground">ریال</span>
					{isShopkeeper && (
						<span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">قیمت نقدی</span>
					)}
				</div>
				{!!product.consumerPrice && product.consumerPrice !== price && (
					<p className="text-sm text-muted-foreground line-through">قیمت مصرف‌کننده: {formatPrice(product.consumerPrice)} ریال</p>
				)}
				{isShopkeeper && !!product.step3Price && (
					<div className="flex items-center justify-between rounded-xl border border-dashed border-accent-gold/60 bg-accent-gold/5 px-4 py-3">
						<div>
							<p className="text-xs text-muted-foreground mb-0.5">قیمت چکی</p>
							<p className="text-lg font-semibold text-accent-gold">{formatPrice(product.step3Price)} ریال</p>
						</div>
						<Link href="/contact" className="text-xs font-medium text-accent-gold border border-accent-gold/40 hover:bg-accent-gold/10 transition-colors rounded-lg px-3 py-1.5 shrink-0">
							تماس با فروش
						</Link>
					</div>
				)}
			</div>

			{/* Min order */}
			{product.minOrder > 1 && (
				<div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
					<Package className="w-4 h-4 shrink-0" />
					<span>حداقل سفارش: {new Intl.NumberFormat("fa-IR").format(product.minOrder)} عدد</span>
				</div>
			)}

			{/* Description */}
			{product?.description && (
				<div>
					<h3 className="text-xl font-bold mb-3">توضیحات محصول</h3>
					<p className="text-muted-foreground leading-relaxed">{product.description}</p>
				</div>
			)}

			{/* Cart actions */}
			<div ref={addToCartRef} className="flex gap-4">
				{!accessToken ? null : cartCount > 0 ? (
					<div className="flex-1 flex items-center justify-between rounded-xl border border-primary-rose/40 bg-primary-rose/5 px-4 py-3">
						<button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary-rose hover:border-primary-rose transition-colors" onClick={onRemoveFromCart}>
							<Minus className="w-4 h-4" />
						</button>
						<span className="text-xl font-bold">{cartCount}</span>
						<button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary-rose hover:border-primary-rose transition-colors disabled:opacity-50" disabled={adding || product.quantity === 0 || cartCount >= product.quantity} onClick={onAddToCart}>
							{adding ? <div className="w-4 h-4 border-2 border-primary-rose border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
						</button>
					</div>
				) : (
					<Button variant="luxury" size="lg" className="flex-1 gap-2" disabled={adding || product.quantity === 0 || cartCount >= product.quantity} onClick={onAddToCart}>
						<AnimatePresence mode="wait">
							{adding ? (
								<motion.div key="loading" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
							) : (
								<motion.div key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
									<ShoppingBag className="w-5 h-5" />
									{product.quantity === 0 ? "ناموجود" : "افزودن به سبد خرید"}
								</motion.div>
							)}
						</AnimatePresence>
					</Button>
				)}
			</div>
		</motion.div>
	);
}

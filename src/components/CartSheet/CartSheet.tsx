"use client";

import { motion, AnimatePresence } from "framer-motion";
import { spring } from "@/lib/motion";
import { X, ShoppingCart, Plus, Minus, Trash2, CreditCard, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import useUserStore from "@/store/useUserStore";
import { formatPrice } from "@/utils/formatPrice";
import resolvePrice from "@/utils/resolvePrice";

interface CartSheetProps {
	open: boolean;
	onClose: () => void;
}

export default function CartSheet({ open, onClose }: CartSheetProps) {
	const { items, loading, addItem, removeItem, removeAllOfItem } = useCartStore();
	const { userType } = useUserStore();

	const total = items.reduce((sum, item) => sum + resolvePrice(item.product, userType) * item.count, 0);

	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						key="backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
						onClick={onClose}
					/>

					<motion.div
						key="sheet"
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={spring.default}
						className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl max-h-[80vh] flex flex-col glass-panel"
						style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
					>
						{/* Handle */}
						<div className="flex justify-center pt-3 pb-1">
							<div className="w-10 h-1 rounded-full bg-border" />
						</div>

						{/* Header */}
						<div className="flex items-center justify-between px-5 py-3 border-b border-border">
							<button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-muted">
								<X className="w-4 h-4" />
							</button>
							<h2 className="font-bold text-lg flex items-center gap-2">
								<ShoppingCart className="w-5 h-5" />
								سبد خرید
							</h2>
							<span className="text-sm text-muted-foreground">{new Intl.NumberFormat("fa-IR").format(items.length)} محصول</span>
						</div>

						{/* Items */}
						<div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
							{items.length === 0 ? (
								<div className="text-center py-12">
									<ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
									<p className="text-muted-foreground">سبد خرید خالی است</p>
								</div>
							) : (
								items.map((item) => (
									<div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
										<div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
											{item.product.productPic ? (
												<img src={item.product.productPic} alt={item.product.name} className="w-full h-full object-cover" />
											) : (
												<Package className="w-6 h-6 text-muted-foreground" />
											)}
										</div>

										<div className="flex-1 min-w-0">
											<p className="text-sm font-semibold truncate">{item.product.name}</p>
											<p className="text-xs text-primary-rose font-bold">
												{formatPrice(resolvePrice(item.product, userType) * item.count)} ریال
											</p>
										</div>

										<div className="flex items-center gap-1">
											<button
												disabled={loading}
												onClick={() => removeItem(item.product.id)}
												className="w-7 h-7 rounded-full border border-border flex items-center justify-center"
											>
												<Minus className="w-3 h-3" />
											</button>
											<span className="w-6 text-center text-sm font-bold">
												{new Intl.NumberFormat("fa-IR").format(item.count)}
											</span>
											<button
												disabled={loading}
												onClick={() => addItem(item.product.id)}
												className="w-7 h-7 rounded-full border border-border flex items-center justify-center"
											>
												<Plus className="w-3 h-3" />
											</button>
											<button
												disabled={loading}
												onClick={() => removeAllOfItem(item.product.id, item.count)}
												className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center ms-1"
											>
												<Trash2 className="w-3 h-3 text-destructive" />
											</button>
										</div>
									</div>
								))
							)}
						</div>

						{/* Footer */}
						{items.length > 0 && (
							<div className="px-5 py-4 border-t border-border space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground text-sm">جمع کل</span>
									<span className="font-bold text-lg">{formatPrice(total)} ریال</span>
								</div>
								<div className="flex gap-3">
									<Link href="/cart" className="flex-1" onClick={onClose}>
										<Button variant="outline" className="w-full">مشاهده سبد</Button>
									</Link>
									<Link href="/order" className="flex-1" onClick={onClose}>
										<Button variant="luxury" className="w-full gap-2">
											<CreditCard className="w-4 h-4" />
											تکمیل خرید
										</Button>
									</Link>
								</div>
							</div>
						)}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

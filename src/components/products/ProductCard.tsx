"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Star, ImageIcon, Heart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatPrice";
import resolvePrice from "@/utils/resolvePrice";

interface Props {
	product: Product;
	index: number;
	cartCount: number;
	addingId: number | null;
	wishlistIds: Set<number>;
	wishlistingId: number | null;
	accessToken: string | undefined;
	userType: string | undefined;
	onAddToCart: (e: React.MouseEvent, productId: number) => void;
	onRemoveFromCart: (e: React.MouseEvent, productId: number) => void;
	onToggleWishlist: (e: React.MouseEvent, productId: number) => void;
}

export default function ProductCard({
	product,
	index,
	cartCount,
	addingId,
	wishlistIds,
	wishlistingId,
	accessToken,
	userType,
	onAddToCart,
	onRemoveFromCart,
	onToggleWishlist,
}: Props) {
	const price = resolvePrice(product, userType);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.05 }}
			whileHover={{ y: -6 }}
			className="isolate rounded-[20px] overflow-hidden bg-card border border-border cursor-pointer group shadow-[0_2px_6px_rgba(107,78,113,0.10),0_6px_20px_rgba(107,78,113,0.06)] hover:shadow-[0_4px_12px_rgba(107,78,113,0.18),0_20px_48px_rgba(201,168,117,0.14)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),0_6px_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_4px_12px_rgba(107,78,113,0.35),0_20px_48px_rgba(201,168,117,0.18)] transition-shadow duration-500"
		>
			{/* Image */}
			<div className="relative aspect-square overflow-hidden bg-muted">
				<Link href={`/products/${product.slug}`}>
					{product.productPic ? (
						<img
							src={product.productPic}
							alt={product.name}
							className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-rose/10 to-accent-gold/10">
							<ImageIcon className="w-16 h-16 text-muted-foreground" />
						</div>
					)}
				</Link>

				<div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
					{product.isNew && (
						<Badge variant="new">
							<Star className="w-3 h-3 me-1" />
							جدید
						</Badge>
					)}
					{product.quantity === 0 && <Badge variant="outOfStock">ناموجود</Badge>}
				</div>

				{accessToken && (
					<div className="absolute top-3 left-3 z-20" onClick={(e) => e.preventDefault()}>
						<button
							className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border hover:scale-110 transition-transform disabled:opacity-50"
							onClick={(e) => onToggleWishlist(e, product.id)}
							disabled={wishlistingId === product.id}
						>
							<Heart
								className={`w-4 h-4 transition-colors ${wishlistIds.has(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
							/>
						</button>
					</div>
				)}
			</div>

			{/* Info */}
			<div className="p-4">
				<Link href={`/products/${product.slug}`}>
					<div className="flex items-center gap-2 mb-1">
						{product.brand?.name && (
							<p className="text-xs text-muted-foreground font-semibold truncate">{product.brand.name}</p>
						)}
						{product.category?.name && (
							<Badge variant="outline" className="text-[10px] px-2 py-0.5 shrink-0 bg-secondary-plum/10 border-secondary-plum/30 text-secondary-plum font-semibold tracking-wide rounded-full">
								{product.category.name}
							</Badge>
						)}
					</div>
					<p className="text-sm font-bold text-foreground leading-snug line-clamp-2 mb-3">{product.name}</p>
				</Link>

				<div className="flex items-center justify-between gap-2">
					<Link href={`/products/${product.slug}`} className="flex-1 min-w-0">
						<p className="text-base font-bold text-primary-rose">
							{formatPrice(price)}
							<span className="text-xs text-muted-foreground ms-1">ریال</span>
						</p>
						{!!product.consumerPrice && product.consumerPrice !== price && (
							<p className="text-xs text-muted-foreground line-through">
								{formatPrice(product.consumerPrice)} ریال
							</p>
						)}
					</Link>

					{accessToken && (
						<div className="shrink-0" onClick={(e) => e.preventDefault()}>
							{cartCount > 0 ? (
								<div className="flex items-center bg-muted rounded-full border border-border overflow-hidden">
									<button
										className="w-7 h-8 flex items-center justify-center text-muted-foreground hover:text-primary-rose transition-colors text-sm font-bold"
										onClick={(e) => onRemoveFromCart(e, product.id)}
									>-</button>
									<span className="text-xs font-bold px-1 min-w-[1.25rem] text-center">{cartCount}</span>
									<button
										className="w-7 h-8 flex items-center justify-center text-muted-foreground hover:text-primary-rose transition-colors text-sm font-bold disabled:opacity-50"
										disabled={addingId === product.id || product.quantity === 0 || cartCount >= product.quantity}
										onClick={(e) => onAddToCart(e, product.id)}
									>+</button>
								</div>
							) : (
								<button
									className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-primary-rose/10 hover:bg-primary-rose/20 border border-primary-rose/30 text-primary-rose text-xs font-semibold transition-colors disabled:opacity-50"
									disabled={addingId === product.id || product.quantity === 0}
									onClick={(e) => onAddToCart(e, product.id)}
								>
									{addingId === product.id ? (
										<div className="w-3.5 h-3.5 border-2 border-primary-rose border-t-transparent rounded-full animate-spin" />
									) : (
										<ShoppingBag className="w-3.5 h-3.5" />
									)}
									افزودن
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
}

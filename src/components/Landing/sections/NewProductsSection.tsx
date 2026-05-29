"use client";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatPrice";
import BackgroundPortraits from "@/components/BackgroundPortraits/BackgroundPortraits";

export default function NewProductsSection({ newProducts }: { newProducts: Product[] }) {
	return (
		<section className="relative overflow-hidden bg-landing-background py-24 px-4 md:px-14">
			{/* <BackgroundPortraits count={4} seed={12} /> */}
			<div className="max-w-[1300px] mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mb-12 flex items-end justify-between"
				>
					<div>
						<div className="flex items-center gap-2.5 mb-4">
							<div className="w-6 h-px bg-accent-gold" />
							<p className="text-xs font-bold text-accent-gold">جدید‌ها</p>
						</div>
						<h2 className="text-5xl font-bold leading-tight text-foreground">
							جدیدترین محصولات
						</h2>
					</div>
					<Link
						href="/products"
						className="text-xs font-bold text-foreground/40 hover:text-foreground hover:gap-2.5 inline-flex items-center gap-1.5 transition-all flex-shrink-0"
					>
						مشاهده همه
						<ArrowLeft className="w-3 h-3" />
					</Link>
				</motion.div>

				<div className="flex gap-4 scroll-smooth">
					{newProducts.slice(0, 5).map((prod, i) => (
						<motion.div
							key={prod.id}
							initial={{ opacity: 0, y: 28 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: i * 0.1 }}
							className="relative flex-shrink-0 w-[260px] rounded-[20px] overflow-hidden bg-white dark:bg-card border border-[#0D0B0A]/5 dark:border-border hover:shadow-[0_16px_48px_rgba(13,11,10,.1)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,.4)] hover:-translate-y-1.5 transition-all cursor-pointer group"
						>
							<Link href={`/products/${prod.slug}`} className="absolute inset-0 z-10" aria-label={prod.name} />
							<div className="aspect-square overflow-hidden bg-gradient-to-br from-[#E8E6E3] to-[rgba(212,165,165,.25)] flex items-center justify-center">
								{prod.productPic ? (
									<img
										src={prod.productPic}
										alt={prod.name}
										className="w-full h-full object-cover"
									/>
								) : (
									<ShoppingBag className="w-12 h-12 text-primary-rose/30" />
								)}
							</div>
							<div className="p-4">
								<p className="text-xs text-foreground/30 font-bold mb-1">
									{prod?.brand?.name}
								</p>
								<h4 className="text-sm font-bold mb-2.5 text-foreground line-clamp-1">
									{prod.name}
								</h4>
								<div className="flex items-center justify-between">
									<span className="text-sm font-bold text-primary-rose">
										{formatPrice(Number(prod.resolvedPrice ?? prod.irrPrice ?? prod.price))}
									</span>
									<Badge className="text-[10px] font-bold px-2 py-0.5 bg-accent-gold text-foreground">
										جدید
									</Badge>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

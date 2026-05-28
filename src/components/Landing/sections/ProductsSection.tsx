"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import { Badge } from "@/components/ui/badge";
import MagneticButton from "@/components/Custom/Button/MagneticButton";
import BackgroundPortraits from "@/components/BackgroundPortraits/BackgroundPortraits";

export default function ProductsSection({ products }: { products: Product[] }) {
	return (
		<section className="relative overflow-hidden bg-landing-background py-24 px-4 md:px-14">
			<BackgroundPortraits count={3} seed={7} />
			<div className="max-w-[1300px] mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<div className="flex items-center gap-2.5 mb-4">
						<div className="w-6 h-px bg-accent-gold" />
						<p className="text-xs font-bold text-accent-gold">بهترین‌ها</p>
					</div>
					<h2 className="text-5xl font-bold leading-tight text-foreground">
						محصولات ویژه
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{products.map((prod, i) => (
						<motion.div
							key={prod.id}
							initial={{ opacity: 0, y: 28 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: i * 0.1 }}
							className="relative rounded-2xl overflow-hidden bg-card border border-border cursor-pointer hover:shadow-[0_16px_48px_rgba(13,11,10,.10)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,.45)] transition-all duration-300 group"
						>
							<Link href={`/products/${prod.slug}`} className="absolute inset-0 z-10" aria-label={prod.name} />
							<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-neutral-warm to-primary-rose/20 dark:from-muted dark:to-primary-rose/10 flex items-center justify-center">
								{prod.productPic ? (
									<img
										src={prod.productPic}
										alt={prod.name}
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
									/>
								) : (
									<div className="w-16 h-16 rounded-full bg-primary-rose/20 flex items-center justify-center">
										<span className="text-primary-rose text-2xl font-bold">M</span>
									</div>
								)}

								<div className="absolute top-3 right-3 flex flex-col gap-1.5">
									{prod.isNew && (
										<Badge
											variant="new"
											className="text-xs font-bold px-2.5 py-1 bg-accent-gold text-foreground"
										>
											جدید
										</Badge>
									)}
								</div>

								<motion.div
									initial={{ translateY: "100%" }}
									whileHover={{ translateY: 0 }}
									transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
									className="absolute bottom-0 inset-x-0 z-20 bg-foreground/90 dark:bg-background/95 backdrop-blur-sm p-4 flex items-center gap-3"
								>
									<MagneticButton
										href={`/products/${prod.slug}`}
										className="flex-1 bg-accent-gold text-foreground font-bold px-4 py-2.5 rounded-xl text-sm text-center inline-flex items-center justify-center gap-2 hover:bg-accent-gold/90 hover:shadow-[0_4px_16px_rgba(201,168,117,.35)] transition-all duration-200"
									>
										مشاهده محصول
									</MagneticButton>
								</motion.div>
							</div>

							<div className="p-5">
								<p className="text-xs text-muted-foreground font-semibold mb-1.5 truncate">
									{prod?.brand?.name}
								</p>
								<h3 className="text-sm font-bold mb-4 text-foreground leading-[1.4] line-clamp-2">
									{prod.name}
								</h3>
								<div className="flex items-center justify-between gap-2">
									{prod?.category?.name && (
									<Badge
										variant="secondary"
										className="text-xs font-semibold bg-secondary-plum/10 dark:bg-secondary-plum/20 text-secondary-plum px-2.5 py-1 truncate max-w-[120px]"
									>
										{prod.category.name}
									</Badge>
								)}
									<span className="text-sm font-bold text-primary-rose whitespace-nowrap">
										{formatPrice(Number(prod.resolvedPrice ?? prod.irrPrice ?? prod.price))}
									</span>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

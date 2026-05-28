"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BackgroundPortraits from "@/components/BackgroundPortraits/BackgroundPortraits";

export default function CategoriesSection({ categories }: { categories: Category[] }) {
	return (
		<section className="relative overflow-hidden bg-landing-background py-24 px-4 md:px-14">
			<BackgroundPortraits count={3} seed={2} />
			<div className="max-w-[1300px] mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<div className="flex items-center gap-2.5 mb-4">
						<div className="w-6 h-px bg-accent-gold" />
						<p className="text-xs font-bold text-accent-gold">دسته‌بندی‌ها</p>
					</div>
					<h2 className="text-5xl font-bold leading-tight text-foreground">
						دسته‌بندی محصولات
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] auto-rows-[240px] md:grid-rows-[280px_280px] gap-3.5">
					{categories?.slice(0, 5).map((cat, i) => (
						<motion.div
							key={cat.id}
							initial={{ opacity: 0, y: 28 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: i * 0.1 }}
							className={`relative rounded-[20px] overflow-hidden cursor-pointer group bg-[#E8E6E3] ${
								i === 0 ? "md:row-span-2" : ""
							}`}
						>
							<Link href={`/categories/${cat.slug}`} className="absolute inset-0 z-10" aria-label={cat.name} />
							<div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.06] flex items-center justify-center bg-[#E8E6E3] dark:bg-card">
								{cat.categoryPic ? (
									<img
										src={cat.categoryPic}
										alt={cat.name}
										className="w-full h-full object-cover"
									/>
								) : (
									<ArrowLeft className="w-16 h-16 text-primary-rose/40" />
								)}
							</div>

							<div className="absolute inset-0 border border-transparent group-hover:border-primary-rose/30 transition-colors duration-300 rounded-[20px]" />

							<div className="absolute bottom-0 right-0 left-0 p-4">
								<div className="bg-background/80 dark:bg-card/85 backdrop-blur-md rounded-xl p-3.5 border border-border/50 translate-y-1 opacity-90 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
									<p className="text-xs font-bold text-accent-gold mb-1">
										دسته‌بندی
									</p>
									<h3 className="text-base font-bold leading-tight text-foreground">
										{cat.name}
									</h3>
									<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
										{cat.description || "محصولات متنوع"}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

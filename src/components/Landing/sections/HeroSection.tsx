"use client";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Magnet from "@/components/utils/Magnet";
import CardStack from "@/components/Landing/CardStack/CardStack";
import styles from "@/components/Landing/Landing.module.css";
import type { PublicStats } from "@/services/statsService";

function roundUsersCount(count: number): string {
	if (count < 100) {
		return new Intl.NumberFormat("fa-IR").format(Math.floor(count / 10) * 10) + "+";
	}
	return new Intl.NumberFormat("fa-IR").format(Math.floor(count / 100) * 100) + "+";
}

export default function HeroSection({ stats }: { stats: PublicStats | null }) {
	return (
		<section className="relative min-h-screen items-center justify-center overflow-hidden pt-12 lg:pt-32 will-change-transform">
			<div>
				<div className="absolute inset-0">
					<div
						className="absolute inset-0"
						style={{
							background: `
							radial-gradient(ellipse 70% 55% at 15% 30%, var(--gradient-1) 0%, transparent 65%),
							radial-gradient(ellipse 50% 60% at 85% 20%, var(--gradient-2) 0%, transparent 60%),
							radial-gradient(ellipse 60% 40% at 50% 90%, var(--gradient-3) 0%, transparent 55%)
						`,
							animation: "meshmove 12s ease-in-out infinite alternate",
						}}
					/>
					<div
						className="absolute inset-0 opacity-[0.04]"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
						}}
					/>
				</div>

				<div className="container mx-auto px-6 relative z-10 max-w-[1300px]">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-end">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.8 }}
							className="pb-2"
						>
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
								className="flex items-center gap-3 mb-7"
							>
								<div className="w-8 h-px bg-accent-gold" />
								<p className="text-xs font-bold text-accent-gold no-select">
									محصولات لوکس آرایشی
								</p>
							</motion.div>

							<motion.h1
								initial={{ opacity: 0, scale: 0.88 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
								className="font-bold mb-8 leading-[1.00] no-select text-foreground"
								style={{ fontSize: "clamp(6rem, 11vw, 10.5rem)" }}
							>
								ماهورا
							</motion.h1>

							<motion.p
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.55, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
								className="text-base text-foreground/60 max-w-sm mb-11 leading-[1.75] no-select"
							>
								تجربه زیبایی بی‌نظیر
							</motion.p>

							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.7, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
								className="flex gap-3 mb-12 flex-wrap"
							>
								<Magnet className="z-30">
									<Link href="/products">
										<Button className="rounded-full h-16 w-48 bg-foreground hover:bg-foreground">
											<ShoppingBag className="w-5 h-5" />
											<p>مشاهده محصولات</p>
										</Button>
									</Link>
								</Magnet>
								<Magnet className="z-20">
									<Link href="/about">
										<Button
											className="rounded-full h-16 w-48 hover:bg-transparent"
											variant="ghost"
										>
											<p>درباره ماهورا</p>
											<ArrowLeft className="w-5 h-5" />
										</Button>
									</Link>
								</Magnet>
							</motion.div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0, duration: 0.1 }}
							className="relative hidden md:block h-[540px]"
						>
							<div className="relative w-full h-full flex items-center justify-center">
								<CardStack />

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.0, ease: [0.25, 1, 0.5, 1] }}
									className={`absolute top-0 flex no-select border-pill-border bg-pill-bg place-items-center gap-2 right-0 place-self-end text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-lg border border-white/12 bg-white/8 whitespace-nowrap animate-float ${styles.pill}`}
									style={{ animationDelay: "-4.8s" }}
								>
									<div className={styles.pillDot} />
									<p>جدیدترین محصولات</p>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.0, ease: [0.25, 1, 0.5, 1] }}
									className={`absolute top-24 -left-10 no-select border-pill-border bg-pill-bg text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-lg border border-white/12 bg-white/8 whitespace-nowrap animate-float ${styles.pill}`}
									style={{ animationDelay: "-2.5s" }}
								>
									<div className={`${styles.pillDot} ${styles.pillDotGreen}`} />
									<p>۱۰۰+ مشتری راضی</p>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.0, ease: [0.25, 1, 0.5, 1] }}
									className={`absolute bottom-[120px] no-select border-pill-border bg-pill-bg -right-10 flex place-items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-lg border border-white/12 bg-white/8 whitespace-nowrap animate-float ${styles.pill}`}
									style={{ animationDelay: "-1.1s" }}
								>
									<div className={`${styles.pillDot} ${styles.pillDotPink}`} />
									بهترین کیفیت
								</motion.div>
							</div>
						</motion.div>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.9, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
					className="border-t border-white/7 mt-8 py-12 flex gap-0"
				>
					{[
						{
							value: stats ? new Intl.NumberFormat("fa-IR").format(stats.productsCount) : "—",
							label: "محصول",
						},
						{
							value: stats ? new Intl.NumberFormat("fa-IR").format(stats.brandsCount) : "—",
							label: "برند",
						},
						{
							value: stats ? roundUsersCount(stats.usersCount) : "—",
							label: "مشتری راضی",
						},
					].map((stat, i) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.0 + i * 0.1, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
							className="flex-1 place-items-center"
						>
							<div className="text-5xl font-bold mb-1 leading-none text-primary-rose">
								{stat.value}
							</div>
							<div className="text-xs text-foreground/50">
								{stat.label}
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

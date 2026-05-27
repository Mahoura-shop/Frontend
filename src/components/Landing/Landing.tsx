"use client";
import styles from "./Landing.module.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Stars } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import MagneticButton from "@/components/Custom/Button/MagneticButton";
import Magnet from "../utils/Magnet";
import CardStack from "./CardStack/CardStack";
import TrustBar from "./TrustBar/TrustBar";
import Grainient from "../ReactBits/Grainient/Grainient";
import { getPublicStats, type PublicStats } from "@/services/statsService";

function roundUsersCount(count: number): string {
	if (count < 100) {
		return new Intl.NumberFormat("fa-IR").format(Math.floor(count / 10) * 10) + "+";
	}
	return new Intl.NumberFormat("fa-IR").format(Math.floor(count / 100) * 100) + "+";
}

export default function LandingPage() {
	const { products } = useProductStore();
	const { categories, fetchCategories } = useCategoryStore();
	const [stats, setStats] = useState<PublicStats | null>(null);

	useEffect(() => {
		fetchCategories();
		getPublicStats().then(setStats).catch(() => {});
	}, []);

	const newProducts = products.filter((p) => p.isNew).slice(0, 6);

	return (
		<div>
			{/* Hero Section */}
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
								animation:
									"meshmove 12s ease-in-out infinite alternate",
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
							{/* Right Column */}
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

							{/* Left Column - Visual (hidden on mobile) */}
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0, duration: 0.1 }}
								className="relative hidden md:block h-[540px]"
							>
								<div className="relative w-full h-full flex items-center justify-center">
									<CardStack />

									{/* Floating pills */}
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

			{/* Marquee Container */}
			<div className="bg-accent-gold overflow-hidden py-5 flex items-center no-select">
				<motion.div
					initial={{ x: "50%" }}
					animate={{ x: "0%" }}
					transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
					className="flex flex-row-reverse whitespace-nowrap ltr w-fit"
				>
					{[...Array(2)].map((_, batch) => (
						<div key={batch} className="flex flex-row-reverse items-center">
							{[
								"ماهورا",
								"بهترین کیفیت",
								"ضمانت اصالت",
								"تجربه‌ی زیبایی لوکس",
								"زیبایی بی‌نظیر",
								"آبرسانی عمیق",
								"شادابی پوست",
								"ترمیم پیشرفته",
								"برترین برندهای جهانی",
								"تقویت سد دفاعی پوست",
								"پوستی لطیف",
							].map((item, i) => (
								<div
									key={`${batch}-${i}`}
									className="flex flex-row-reverse items-center gap-8 px-4 text-[#0D0B0A] text-sm font-bold"
								>
									<p>{item}</p>
									<span className="w-1 h-1 bg-[#0D0B0A] rounded-full opacity-40" />
								</div>
							))}
						</div>
					))}
				</motion.div>
			</div>

			<TrustBar />

			{/* Categories Masonry */}
			<section className="bg-landing-background py-24 px-4 md:px-14">
				<div className="max-w-[1300px] mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-16"
					>
						<div className="flex items-center gap-2.5 mb-4">
							<div className="w-6 h-px bg-accent-gold" />
							<p className="text-xs font-bold text-accent-gold">
								دسته‌بندی‌ها
							</p>
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

			{/* Products Grid */}
			<section className="bg-landing-background py-24 px-4 md:px-14">
				<div className="max-w-[1300px] mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-16"
					>
						<div className="flex items-center gap-2.5 mb-4">
							<div className="w-6 h-px bg-accent-gold" />
							<p className="text-xs font-bold text-accent-gold">
								بهترین‌ها
							</p>
						</div>
						<h2 className="text-5xl font-bold leading-tight text-foreground">
							محصولات ویژه
						</h2>
					</motion.div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{products?.slice(0, 6).map((prod, i) => (
							<motion.div
								key={prod.id}
								initial={{ opacity: 0, y: 28 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: i * 0.1 }}
								className="rounded-2xl overflow-hidden bg-card border border-border cursor-pointer hover:shadow-[0_16px_48px_rgba(13,11,10,.10)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,.45)] transition-all duration-300 group"
							>
								<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-neutral-warm to-primary-rose/20 dark:from-muted dark:to-primary-rose/10 flex items-center justify-center">
									{prod.productPic ? (
										<img
											src={prod.productPic}
											alt={prod.name}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
										/>
									) : (
										<div className="w-16 h-16 rounded-full bg-primary-rose/20 flex items-center justify-center">
											<span className="text-primary-rose text-2xl font-bold">
												M
											</span>
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
										className="absolute bottom-0 inset-x-0 bg-foreground/90 dark:bg-background/95 backdrop-blur-sm p-4 flex items-center gap-3"
									>
										<MagneticButton
											href={`/products/${prod.id}`}
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
										<Badge
											variant="secondary"
											className="text-xs font-semibold bg-secondary-plum/10 dark:bg-secondary-plum/20 text-secondary-plum px-2.5 py-1 truncate max-w-[120px]"
										>
											{prod?.category?.name}
										</Badge>
										<span className="text-sm font-bold text-primary-rose whitespace-nowrap">
											{formatPrice(
												Number(
													prod.resolvedPrice ??
														prod.irrPrice ??
														prod.price,
												),
											)}
										</span>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<div style={{ width: "100%", height: "600px", position: "absolute" }}>
				<Grainient
					color1="#D4A5A5"
					color2="#6B4E71"
					color3="#C9A875"
					timeSpeed={0.5}
					colorBalance={0}
					warpStrength={1}
					warpFrequency={5}
					warpSpeed={2}
					warpAmplitude={50}
					blendAngle={0}
					blendSoftness={0.05}
					rotationAmount={500}
					noiseScale={2}
					grainAmount={0.1}
					grainScale={2}
					grainAnimated={false}
					contrast={1.5}
					gamma={1}
					saturation={1}
					centerX={0}
					centerY={0}
					zoom={0.9}
				/>
			</div>
			<section className="px-4 md:px-14 relative overflow-hidden h-screen m-auto flex place-items-center">
				<div className="max-w-[900px] mx-auto flex place-content-center align-middle place-items-center text-center relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
					>
						<div className="flex items-center justify-center gap-3.5 mb-8">
							<div className="w-10 h-px bg-accent-gold/40" />
							<p className="font-bold text-6xl">درباره برند</p>
							<div className="w-10 h-px bg-accent-gold/40" />
						</div>

						<p className="text-4xl font-bold mb-7 leading-tight">
							زیبایی یک هنر است
						</p>

						<p className="text-lg mb-12 font-bold max-w-[580px] mx-auto leading-[1.85]">
							ماهورا با انتخاب بهترین محصولات آرایشی و بهداشتی،
							تجربه‌ای منحصربه‌فرد از زیبایی را برای شما به ارمغان
							می‌آورد
						</p>

						<Magnet>
							<Link href="/products">
								<Button
									className="rounded-full h-16 w-48 hover:bg-transparent"
									variant="ghost"
								>
									<p>کشف کنید</p>
									<Stars className="fill-foreground" />
								</Button>
							</Link>
						</Magnet>
					</motion.div>
				</div>
			</section>

			{/* New Products - Horizontal Scroll */}
			{newProducts.length > 0 && (
				<section className="bg-landing-background py-24 px-4 md:px-14 overflow-hidden">
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
									<p className="text-xs font-bold text-accent-gold">
										جدید‌ها
									</p>
								</div>
								<h2 className="text-5xl font-bold leading-tight text-foreground">
									جدیدترین محصولات
								</h2>
							</div>
							<Link
								href="/products"
								className="text-xs font-bold text-[#0D0B0A]/40 hover:text-[#0D0B0A] hover:gap-2.5 inline-flex items-center gap-1.5 transition-all flex-shrink-0"
							>
								مشاهده همه
								<ArrowLeft className="w-3 h-3" />
							</Link>
						</motion.div>

						<div className="flex gap-4 overflow-x-auto pb-6 scroll-smooth">
							{newProducts.map((prod, i) => (
								<motion.div
									key={prod.id}
									initial={{ opacity: 0, y: 28 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: i * 0.1 }}
									className="flex-shrink-0 w-[260px] rounded-[20px] overflow-hidden bg-white dark:bg-card border border-[#0D0B0A]/5 dark:border-border hover:shadow-[0_16px_48px_rgba(13,11,10,.1)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,.4)] hover:-translate-y-1.5 transition-all cursor-pointer group"
								>
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
										<p className="text-xs text-[#0D0B0A]/30 font-bold mb-1">
											{prod?.brand?.name}
										</p>
										<h4 className="text-sm font-bold mb-2.5 text-[#0D0B0A] line-clamp-1">
											{prod.name}
										</h4>
										<div className="flex items-center justify-between">
											<span className="text-sm font-bold text-primary-rose">
												{formatPrice(
													Number(
														prod.resolvedPrice ??
															prod.irrPrice ??
															prod.price,
													),
												)}
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
			)}
		</div>
	);
}

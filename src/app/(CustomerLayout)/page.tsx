"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
	ShoppingBag,
	Heart,
	ArrowLeft,
	Truck,
	ShieldCheck,
	RefreshCcw,
	Headphones,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/useProductStore";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { getData } from "@/services/services";
import { useCategoryStore } from "@/store/useCategoryStore";
import MagneticButton from "@/components/Custom/Button/MagneticButton";

const useMagnetic = () => {
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!ref.current) return;

			const rect = ref.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const distX = e.clientX - centerX;
			const distY = e.clientY - centerY;
			const distance = Math.sqrt(distX * distX + distY * distY);
			const maxDistance = 120;

			if (distance < maxDistance) {
				const strength = 1 - distance / maxDistance;
				const angle = Math.atan2(distY, distX);
				const pullDistance = strength * 40;
				setOffset({
					x: Math.cos(angle) * pullDistance,
					y: Math.sin(angle) * pullDistance,
				});
			} else {
				setOffset({ x: 0, y: 0 });
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return { ref, offset };
};

// const MagneticButton = ({ children, href, className = "", ...props }: any) => {
// 	const ref = useRef<HTMLDivElement>(null);
// 	const [offset, setOffset] = useState({ x: 0, y: 0 });

// 	useEffect(() => {
// 		const handleMouseMove = (e: MouseEvent) => {
// 			if (!ref.current) return;

// 			const rect = ref.current.getBoundingClientRect();
// 			const centerX = rect.left + rect.width / 2;
// 			const centerY = rect.top + rect.height / 2;

// 			const distX = e.clientX - centerX;
// 			const distY = e.clientY - centerY;
// 			const distance = Math.sqrt(distX * distX + distY * distY);
// 			const maxDistance = 120;

// 			if (distance < maxDistance) {
// 				const strength = 1 - distance / maxDistance;
// 				const angle = Math.atan2(distY, distX);
// 				const pullDistance = strength * 40;
// 				setOffset({
// 					x: Math.cos(angle) * pullDistance,
// 					y: Math.sin(angle) * pullDistance,
// 				});
// 			} else {
// 				setOffset({ x: 0, y: 0 });
// 			}
// 		};

// 		window.addEventListener("mousemove", handleMouseMove);
// 		return () => window.removeEventListener("mousemove", handleMouseMove);
// 	}, []);

// 	return (
// 		<Link href={href}>
// 			<motion.div
// 				ref={ref}
// 				animate={{ x: offset.x, y: offset.y }}
// 				transition={{ duration: 0.4, ease: "easeOut" }}
// 				className={className}
// 				{...props}
// 			>
// 				{children}
// 			</motion.div>
// 		</Link>
// 	);
// };

export default function LandingPage() {
	const { products } = useProductStore();
	const { categories, fetchCategories } = useCategoryStore();

	const [brandsCount, setBrandsCount] = useState<number>(0);
	const [categoriesCount, setCategoriesCount] = useState<number>(0);
	const [productsCount, setProductsCount] = useState<number>(0);

	const fetchSiteData = () => {
		getData({ endPoint: `/v1/admin/dashboard` }).then((data) => {
			setProductsCount(data?.data?.productsCount);
			setBrandsCount(data?.data?.brandsCount);
			setCategoriesCount(data?.data?.categoriesCount);
		});
	};

	useEffect(() => {
		fetchSiteData();
		fetchCategories();
	}, []);

	const newProducts = products.filter((p) => p.isNew).slice(0, 6);

	return (
		<div className="bg-[#0D0B0A] text-white">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
				{/* Mesh gradient background */}
				<div className="absolute inset-0">
					<div
						className="absolute inset-0"
						style={{
							background: `
								radial-gradient(ellipse 70% 55% at 15% 30%, rgba(212,165,165,.18) 0%, transparent 65%),
								radial-gradient(ellipse 50% 60% at 85% 20%, rgba(107,78,113,.22) 0%, transparent 60%),
								radial-gradient(ellipse 60% 40% at 50% 90%, rgba(201,168,117,.10) 0%, transparent 55%)
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

				{/* Floating orbs */}
				<div className="absolute -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#D4A5A5]/12 to-transparent blur-[80px] pointer-events-none opacity-0 group-[] animate-pulse" />
				<div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#6B4E71]/15 to-transparent blur-[80px] pointer-events-none opacity-0 animate-pulse" />

				<div className="container mx-auto px-6 relative z-10 max-w-[1300px]">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-end">
						{/* Left Column */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.8 }}
							className="pb-2"
						>
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2, duration: 0.7 }}
								className="flex items-center gap-3 mb-7"
							>
								<div className="w-8 h-px bg-[#C9A875]" />
								<p className="text-xs font-bold tracking-[0.28em] text-[#C9A875] uppercase">
									محصولات لوکس آرایشی
								</p>
							</motion.div>

							<motion.h1
								initial={{ opacity: 0, scale: 0.85 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4, duration: 0.9, type: "spring", stiffness: 40 }}
								className="font-bold mb-8 leading-[0.88]"
								style={{
									fontSize: "clamp(6rem, 11vw, 10.5rem)",
									background: "linear-gradient(135deg, #D4A5A5 0%, #C9A875 50%, rgba(107,78,113,.9) 100%)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									backgroundClip: "text",
								}}
							>
								ماهورا
							</motion.h1>

							<motion.p
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.55, duration: 0.7 }}
								className="text-base text-white/45 max-w-sm mb-11 leading-[1.75]"
							>
								تجربه زیبایی بی‌نظیر
							</motion.p>

								<motion.div
									initial={{ opacity: 0, y: 16 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.7, duration: 0.7 }}
									className="flex gap-3 mb-12 flex-wrap"
								>
									<MagneticButton
										href="/products"
										variant="primary"
									>
										<ShoppingBag className="w-5 h-5" />
										مشاهده محصولات
									</MagneticButton>
									<Link href="/about">
										{/* <Button
											variant="outline"
											className="border border-white/20 text-white/70 px-7 py-4 hover:border-white/50 hover:text-white"
										>
											درباره ما
										</Button> */}
										<MagneticButton
											href="/aboutus"
											variant="ghost"
										>
											درباره ماهورا
											<ArrowLeft className="w-5 h-5" />
										</MagneticButton>
									</Link>
								</motion.div>


							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.9, duration: 0.7 }}
								className="border-t border-white/7 pt-12 flex gap-0"
							>
								{[
									{
										value: new Intl.NumberFormat("fa-IR").format(productsCount),
										label: "محصول",
									},
									{
										value: new Intl.NumberFormat("fa-IR").format(brandsCount),
										label: "برند",
									},
									{ value: "۱۰۰+", label: "مشتری راضی" },
								].map((stat, i) => (
									<motion.div
										key={stat.label}
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{
											delay: 1.0 + i * 0.1,
											type: "spring",
											stiffness: 50,
										}}
										className="flex-1 pr-9"
									>
										<div
											className="text-5xl font-bold mb-1 leading-none"
											style={{
												background: "linear-gradient(90deg, #D4A5A5, #C9A875)",
												WebkitBackgroundClip: "text",
												WebkitTextFillColor: "transparent",
												backgroundClip: "text",
											}}
										>
											{stat.value}
										</div>
										<div className="text-xs text-white/35">
											{stat.label}
										</div>
									</motion.div>
								))}
							</motion.div>
						</motion.div>

						{/* Right Column - Visual (hidden on mobile) */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0, duration: 0.1 }}
							className="relative hidden md:block h-[540px]"
						>
							<div className="relative w-full h-full flex items-center justify-center">
								{/* Card stack - all move together on hover */}
								<motion.div
									className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px]"
									whileHover="hover"
									initial="idle"
									variants={{
										idle: {},
										hover: {},
									}}
								>
									{/* Card 3 */}
									<motion.div
										className="absolute w-60 h-80 rounded-2xl overflow-hidden shadow-2xl"
										style={{
											bottom: "-12px",
											left: "50%",
											background: "linear-gradient(160deg, #2a1f2e, #1a1218)",
											border: "1px solid rgba(107,78,113,.3)",
											zIndex: 1,
										}}
										initial={{
											transform: "translateX(-50%) rotate(-8deg) translateY(12px)",
										}}
										variants={{
											idle: {
												transform: "translateX(-50%) rotate(-8deg) translateY(12px)",
											},
											hover: {
												transform:
													"translateX(calc(-50% - 100px)) rotate(-14deg) translateY(-20px)",
											},
										}}
										transition={{ duration: 0.3 }}
									/>

									{/* Card 2 */}
									<motion.div
										className="absolute w-[260px] h-[360px] rounded-2xl overflow-hidden shadow-2xl"
										style={{
											bottom: "-6px",
											left: "50%",
											background: "linear-gradient(160deg, #281e1a, #1a1210)",
											border: "1px solid rgba(212,165,165,.2)",
											zIndex: 2,
										}}
										initial={{
											transform: "translateX(-50%) rotate(-3deg) translateY(6px)",
										}}
										variants={{
											idle: {
												transform: "translateX(-50%) rotate(-3deg) translateY(6px)",
											},
											hover: {
												transform:
													"translateX(calc(-50% + 100px)) rotate(10deg) translateY(-10px)",
											},
										}}
										transition={{ duration: 0.3 }}
									/>

									{/* Card 1 - Main */}
									<motion.div
										className="absolute w-[280px] h-[400px] rounded-2xl overflow-hidden shadow-2xl"
										style={{
											bottom: 0,
											left: "50%",
											background: "linear-gradient(160deg, #2e2420, #1c1410)",
											border: "1px solid rgba(201,168,117,.15)",
											zIndex: 3,
										}}
										initial={{
											transform: "translateX(-50%) rotate(0deg)",
										}}
										variants={{
											idle: {
												transform: "translateX(-50%) rotate(0deg)",
											},
											hover: {
												transform:
													"translateX(-50%) rotate(-2deg) translateY(-30px) scale(1.03)",
											},
										}}
										transition={{ duration: 0.3 }}
									>
										<img
											src={products[0]?.productPic || "https://via.placeholder.com/280x400"}
											alt="Featured Product"
											className="w-full h-full object-cover"
										/>
									</motion.div>
								</motion.div>

								{/* Floating pills */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.0 }}
									className="absolute top-12 -left-20 text-sm font-semibold text-white px-4 py-2 rounded-full backdrop-blur-lg border border-white/12 bg-white/8 whitespace-nowrap animate-float"
									style={{ animationDelay: "0.2s" }}
								>
									✦ جدیدترین محصول
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.0 }}
									className="absolute -bottom-12 -right-20 text-sm font-semibold text-white px-4 py-2 rounded-full backdrop-blur-lg border border-white/12 bg-white/8 whitespace-nowrap animate-float"
									style={{ animationDelay: "0.5s" }}
								>
									★★★★★ ۱۰۰+ مشتری راضی
								</motion.div>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Scroll indicator */}
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ repeat: Infinity, duration: 1.8 }}
					className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 opacity-50"
				>
					<p className="text-xs tracking-[0.2em] uppercase text-white/50">
						اسکرول کنید
					</p>
					<div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
				</motion.div>
			</section>

			{/* Marquee */}
			<div className="bg-[#C9A875] overflow-hidden py-4.5 px-14">
				<motion.div
					initial={{ x: 0 }}
					animate={{ x: "-50%" }}
					transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
					className="flex gap-8 whitespace-nowrap"
				>
					{[...Array(2)].map((_, batch) =>
						["بهترین کیفیت", "ارسال رایگان", "ضمانت اصالت"].map((item, i) => (
							<span
								key={`${batch}-${i}`}
								className="text-[#0D0B0A] text-sm font-bold tracking-wider uppercase flex items-center gap-4"
							>
								{item}
								<span className="w-1 h-1 bg-[#0D0B0A] rounded-full opacity-40" />
							</span>
						))
					)}
				</motion.div>
			</div>

			{/* Trust Bar */}
			<section className="bg-[#F8F6F4] py-20 px-14">
				<div className="max-w-[1300px] mx-auto">
					<div className="grid grid-cols-4 gap-0.5">
						{[
							{
								icon: ShoppingBag,
								title: "ارسال سریع",
								sub: "تحویل در کمترین زمان",
							},
							{
								icon: ShieldCheck,
								title: "محصولات اصل",
								sub: "تضمین اصالت کالا",
							},
							{
								icon: RefreshCcw,
								title: "ضمانت بازگشت",
								sub: "۷ روز ضمانت",
							},
							{
								icon: Headphones,
								title: "پشتیبانی",
								sub: "پاسخگویی ۲۴/۷",
							},
						].map((item, i) => {
							const Icon = item.icon;
							return (
								<motion.div
									key={item.title}
									initial={{ opacity: 0, y: 24 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.6,
										ease: "easeOut",
										delay: i * 0.1,
									}}
									className="px-8 py-9 border-l border-[#0D0B0A]/8 flex flex-col gap-3.5"
									style={{
										borderLeftColor:
											i === 0 ? "transparent" : "rgba(13,11,10,.08)",
									}}
								>
									<div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[rgba(212,165,165,.25)] to-[rgba(201,168,117,.15)] flex items-center justify-center text-[#6B4E71]">
										<Icon className="w-6 h-6" />
									</div>
									<h3 className="font-bold text-[15px] text-[#0D0B0A]">
										{item.title}
									</h3>
									<p className="text-xs text-[#0D0B0A]/45 leading-[1.6]">
										{item.sub}
									</p>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Categories Masonry */}
			<section className="bg-[#F8F6F4] py-24 px-14">
				<div className="max-w-[1300px] mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-16"
					>
						<div className="flex items-center gap-2.5 mb-4">
							<div className="w-6 h-px bg-[#C9A875]" />
							<p className="text-xs font-bold tracking-[0.22em] text-[#C9A875] uppercase">
								دسته‌بندی‌ها
							</p>
						</div>
						<h2
							className="text-5xl font-bold leading-tight"
							style={{
								background:
									"linear-gradient(90deg, #D4A5A5 0%, #C9A875 50%, rgba(107,78,113,.9) 100%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							دسته‌بندی محصولات
						</h2>
					</motion.div>

					<div className="grid grid-cols-[1.4fr_1fr_1fr] grid-rows-[280px_280px] gap-3.5">
						{categories?.slice(0, 5).map((cat, i) => (
							<motion.div
								key={cat.id}
								initial={{ opacity: 0, y: 28 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{
									duration: 0.6,
									ease: "easeOut",
									delay: i * 0.1,
								}}
								className={`relative rounded-[20px] overflow-hidden cursor-pointer group bg-[#E8E6E3] ${
									i === 0 ? "row-span-2" : ""
								}`}
							>
								<div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.06] flex items-center justify-center bg-[#E8E6E3]">
									{cat.categoryPic ? (
										<img
											src={cat.categoryPic}
											alt={cat.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<ArrowLeft className="w-16 h-16 text-[#D4A5A5]/40" />
									)}
								</div>

								<div
									className="absolute inset-0 opacity-0 group-hover:opacity-[1.25] transition-opacity duration-400"
									style={{
										background:
											"linear-gradient(to top, rgba(13,11,10,.8) 0%, rgba(13,11,10,.15) 45%, transparent 100%)",
									}}
								/>

								<div className="absolute inset-0 border border-white/0 group-hover:border-[#D4A5A5]/30 transition-colors duration-300 rounded-[20px]" />

								<div className="absolute bottom-0 right-0 left-0 p-6 text-white">
									<p className="text-xs font-bold tracking-[0.18em] text-[#C9A875] mb-1.5 uppercase">
										دسته‌بندی
									</p>
									<h3 className="text-2xl font-bold mb-1 leading-tight">
										{cat.name}
									</h3>
									<p className="text-xs text-white/50 mb-3.5">
										{cat.description || "محصولات متنوع"}
									</p>
									<div className="inline-flex items-center gap-1.5 px-3.5 py-1.75 text-xs font-bold text-white bg-white/12 backdrop-blur-[8px] border border-white/15 rounded-full opacity-0 translate-y-1.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
										مشاهده
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Products Grid */}
			<section className="bg-[#0D0B0A] py-24 px-14">
				<div className="max-w-[1300px] mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-16"
					>
						<div className="flex items-center gap-2.5 mb-4">
							<div className="w-6 h-px bg-[#C9A875]" />
							<p className="text-xs font-bold tracking-[0.22em] text-[#C9A875] uppercase">
								بهترین‌ها
							</p>
						</div>
						<h2
							className="text-5xl font-bold leading-tight text-white"
							style={{
								background:
									"linear-gradient(90deg, #D4A5A5 0%, #C9A875 50%, rgba(107,78,113,.9) 100%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							محصولات ویژه
						</h2>
					</motion.div>

					<div className="grid grid-cols-3 gap-5">
						{products?.slice(0, 6).map((prod, i) => (
							<motion.div
								key={prod.id}
								initial={{ opacity: 0, y: 28 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{
									duration: 0.6,
									ease: "easeOut",
									delay: i * 0.1,
								}}
								className="rounded-[20px] overflow-hidden bg-white cursor-pointer hover:shadow-[0_20px_60px_rgba(13,11,10,.12)] transition-all group"
							>
								<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#E8E6E3] to-[rgba(212,165,165,.3)] flex items-center justify-center">
									{prod.productPic ? (
										<img
											src={prod.productPic}
											alt={prod.name}
											className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.07]"
										/>
									) : (
										<span className="text-6xl">💄</span>
									)}

									<div className="absolute top-3.5 right-3.5 flex flex-col gap-1.5">
										{prod.isNew && (
											<Badge
												variant="new"
												className="text-xs font-bold px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white animate-pulse-glow"
											>
												جدید
											</Badge>
										)}
									</div>

									<motion.div
										initial={{ translateY: "100%" }}
										whileHover={{ translateY: 0 }}
										transition={{ duration: 0.4, ease: "easeOut" }}
										className="absolute bottom-0 inset-x-0 bg-[#0D0B0A]/85 p-5 flex flex-col items-end gap-3"
									>
										<MagneticButton
											href={`/products/${prod.id}`}
											className="w-full bg-[#C9A875] text-[#0D0B0A] font-bold px-4 py-3 rounded-[12px] text-sm text-center inline-flex items-center justify-center gap-2 hover:shadow-[0_6px_20px_rgba(201,168,117,.4)] transition-all"
										>
											افزودن به سبد
										</MagneticButton>
									</motion.div>
								</div>

								<div className="p-4.5">
									<p className="text-xs text-[#0D0B0A]/35 font-bold tracking-[0.1em] uppercase mb-1.25">
										{prod?.brand?.name}
									</p>
									<h3 className="text-base font-bold mb-3.5 text-[#0D0B0A] leading-[1.3] line-clamp-2">
										{prod.name}
									</h3>
									<div className="flex items-center justify-between">
										<Badge
											variant="secondary"
											className="text-xs font-bold bg-[#6B4E71]/10 text-[#6B4E71] px-3 py-1"
										>
											{prod?.category?.name}
										</Badge>
										<span className="text-base font-bold text-[#D4A5A5]">
											{prod.price}
										</span>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Statement Section */}
			<section className="bg-[#0D0B0A] py-32 px-14 relative overflow-hidden">
				<div
					className="absolute inset-0 opacity-20"
					style={{
						background: `
							radial-gradient(ellipse 50% 70% at 90% 50%, rgba(107,78,113,.2), transparent),
							radial-gradient(ellipse 40% 50% at 10% 30%, rgba(212,165,165,.1), transparent)
						`,
						animation: "meshmove 15s ease-in-out infinite alternate",
					}}
				/>

				<div className="max-w-[900px] mx-auto text-center relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.9 }}
					>
						<div className="flex items-center justify-center gap-3.5 mb-8">
							<div className="w-10 h-px bg-[#C9A875]/40" />
							<p className="text-xs font-bold tracking-[0.25em] text-[#C9A875] uppercase">
								درباره برند
							</p>
							<div className="w-10 h-px bg-[#C9A875]/40" />
						</div>

						<h2
							className="text-7xl font-bold mb-7 leading-tight"
							style={{
								background:
									"linear-gradient(135deg, white 0%, #D4A5A5 50%, #C9A875 100%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							زیبایی یک هنر است
						</h2>

						<p className="text-lg text-white/50 mb-12 max-w-[580px] mx-auto leading-[1.85]">
							ماهورا با انتخاب بهترین محصولات آرایشی و بهداشتی، تجربه‌ای منحصربه‌فرد از زیبایی را برای شما به ارمغان می‌آورد
						</p>

						<MagneticButton
							href="/products"
							className="bg-[#C9A875] text-[#0D0B0A] font-bold px-11 py-4.5 hover:scale-[1.06] hover:shadow-[0_14px_40px_rgba(201,168,117,.4)] transition-all"
						>
							کشف کنید
						</MagneticButton>
					</motion.div>
				</div>
			</section>

			{/* New Products - Horizontal Scroll */}
			{newProducts.length > 0 && (
				<section className="bg-[#F8F6F4] py-24 px-14 overflow-hidden">
					<div className="max-w-[1300px] mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="mb-12 flex items-end justify-between"
						>
							<div>
								<div className="flex items-center gap-2.5 mb-4">
									<div className="w-6 h-px bg-[#C9A875]" />
									<p className="text-xs font-bold tracking-[0.22em] text-[#C9A875] uppercase">
										جدید‌ها
									</p>
								</div>
								<h2
									className="text-5xl font-bold leading-tight"
									style={{
										background:
											"linear-gradient(90deg, #D4A5A5 0%, #C9A875 50%, rgba(107,78,113,.9) 100%)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										backgroundClip: "text",
									}}
								>
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
									transition={{
										duration: 0.6,
										ease: "easeOut",
										delay: i * 0.1,
									}}
									className="flex-shrink-0 w-[260px] rounded-[20px] overflow-hidden bg-white border border-[#0D0B0A]/5 hover:shadow-[0_16px_48px_rgba(13,11,10,.1)] hover:-translate-y-1.5 transition-all cursor-pointer group"
								>
									<div className="aspect-square overflow-hidden bg-gradient-to-br from-[#E8E6E3] to-[rgba(212,165,165,.25)] flex items-center justify-center">
										{prod.productPic ? (
											<img
												src={prod.productPic}
												alt={prod.name}
												className="w-full h-full object-cover"
											/>
										) : (
											<span className="text-5xl">💄</span>
										)}
									</div>
									<div className="p-4">
										<p className="text-xs text-[#0D0B0A]/30 font-bold uppercase mb-1">
											{prod?.brand?.name}
										</p>
										<h4 className="text-sm font-bold mb-2.5 text-[#0D0B0A] line-clamp-1">
											{prod.name}
										</h4>
										<div className="flex items-center justify-between">
											<span className="text-sm font-bold text-[#D4A5A5]">
												{prod.price}
											</span>
											<Badge className="text-[10px] font-bold px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white animate-pulse-glow">
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

			<style>{`
				@keyframes meshmove {
					0% { opacity: 1; transform: scale(1) rotate(0deg); }
					100% { opacity: 0.85; transform: scale(1.08) rotate(1.5deg); }
				}
				@keyframes pulse-glow {
					0%, 100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
					50% { opacity: 0.5; }
				}
				.animate-float {
					animation: float 3s ease-in-out infinite;
				}
				@keyframes float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-10px); }
				}
				.animate-pulse-glow {
					animation: pulse-glow 2s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
}

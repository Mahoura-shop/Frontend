"use client";

import { motion, useInView } from "framer-motion";
import { Instagram, Phone, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import logo from "@/assets/logo.png";

const LINKS = {
	products: [
		{ label: "همه محصولات", href: "/products" },
		{ label: "جدیدترین‌ها", href: "/products?filter=new" },
		{ label: "پرفروش‌ترین‌ها", href: "/products?filter=popular" },
	],
	support: [
		{ label: "درباره ما", href: "/about" },
		{ label: "تماس با ما", href: "/contact" },
	],
};

function FooterLink({ href, label }: { href: string; label: string }) {
	return (
		<li>
			<Link
				href={href}
				className="group flex items-center gap-1 text-white/60 hover:text-accent-gold transition-colors duration-300 text-sm"
			>
				<ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accent-gold" />
				{label}
			</Link>
		</li>
	);
}

export default function Footer() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	const container = {
		hidden: {},
		show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
	};
	const item = {
		hidden: { opacity: 0, y: 28 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
		},
	};

	return (
		<footer
			className="relative overflow-hidden text-white"
			style={{
				background:
					"linear-gradient(160deg, #1e0f2a 0%, #3d2a45 45%, #280f3a 100%)",
			}}
		>
			{/* Gold top line */}
			<div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-70" />

			<div ref={ref} className="relative container mx-auto px-4 pt-16 pb-10">
				<motion.div
					variants={container}
					initial="hidden"
					animate={inView ? "show" : "hidden"}
					className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14"
				>
					{/* Brand */}
					<motion.div variants={item} className="col-span-2 md:col-span-1">
						<motion.div
							animate={{ y: [0, -6, 0] }}
							transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
							className="mb-4 w-fit"
						>
							<Image
								src={logo}
								alt="Mahoura"
								className="w-16 h-16 dark:invert drop-shadow-[0_0_12px_rgba(201,168,117,0.5)]"
							/>
						</motion.div>
						<p className="text-white/50 text-sm leading-relaxed max-w-[200px]">
							تجربه زیبایی بی‌نظیر با محصولات لوکس ماهورا
						</p>
						<div className="mt-5 flex gap-3">
							<motion.a
								href="#"
								whileHover={{ scale: 1.15 }}
								whileTap={{ scale: 0.95 }}
								className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:border-accent-gold hover:bg-accent-gold/10 transition-all duration-300"
								style={{
									boxShadow: "0 0 0 0 rgba(201,168,117,0)",
								}}
								onMouseEnter={(e) => {
									(e.currentTarget as HTMLElement).style.boxShadow =
										"0 0 16px 2px rgba(201,168,117,0.35)";
								}}
								onMouseLeave={(e) => {
									(e.currentTarget as HTMLElement).style.boxShadow =
										"0 0 0 0 rgba(201,168,117,0)";
								}}
							>
								<Instagram className="w-4 h-4 text-white/70 group-hover:text-accent-gold" />
							</motion.a>
						</div>
					</motion.div>

					{/* Products */}
					<motion.div variants={item}>
						<h4 className="text-accent-gold font-semibold text-sm mb-5 tracking-widest uppercase">
							محصولات
						</h4>
						<ul className="space-y-3">
							{LINKS.products.map((l) => (
								<FooterLink key={l.href} {...l} />
							))}
						</ul>
					</motion.div>

					{/* Support */}
					<motion.div variants={item}>
						<h4 className="text-accent-gold font-semibold text-sm mb-5 tracking-widest uppercase">
							پشتیبانی
						</h4>
						<ul className="space-y-3">
							{LINKS.support.map((l) => (
								<FooterLink key={l.href} {...l} />
							))}
						</ul>
					</motion.div>

					{/* Contact */}
					<motion.div variants={item}>
						<h4 className="text-accent-gold font-semibold text-sm mb-5 tracking-widest uppercase">
							تماس
						</h4>
						<a
							href="tel:+989173362580"
							className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 text-sm ltr w-fit"
						>
							<span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
								<Phone className="w-3.5 h-3.5" />
							</span>
							+989173362580
						</a>
					</motion.div>
				</motion.div>

				{/* Bottom bar */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={inView ? { opacity: 1 } : {}}
					transition={{ delay: 0.7, duration: 0.8 }}
					className="relative"
				>
					<div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
						<p>© 1404 ماهورا. تمامی حقوق محفوظ است.</p>
						<div className="flex items-center gap-1">
							<span className="w-1.5 h-1.5 rounded-full bg-accent-gold/60 animate-pulse-glow" />
							<span>ساخته شده با عشق در ایران</span>
						</div>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}

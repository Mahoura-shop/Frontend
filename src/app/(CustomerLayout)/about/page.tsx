"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const values = [
	{
		num: "۰۱",
		title: "کیفیت برتر",
		description: "تمام محصولات ما با بالاترین استانداردهای کیفیتی تولید می‌شوند",
	},
	{
		num: "۰۲",
		title: "تخصص و تجربه",
		description: "بیش از ۱۰ سال تجربه در صنعت زیبایی و آرایشی",
	},
	{
		num: "۰۳",
		title: "رضایت مشتری",
		description: "بیش از ۱۰۰۰ مشتری راضی در سراسر کشور",
	},
	{
		num: "۰۴",
		title: "نوآوری مداوم",
		description: "همیشه در حال ارائه جدیدترین و بهترین محصولات",
	},
];

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-background" dir="rtl">
			<div
				className="relative pt-32 pb-24 px-6 overflow-hidden"
				style={{
					background: "linear-gradient(160deg, #1e0f2a 0%, #3d2a45 45%, #280f3a 100%)",
				}}
			>
				<div
					className="absolute top-0 right-0 left-0 h-[2px]"
					style={{ background: "var(--accent-gold)" }}
				/>
				<div className="max-w-4xl mx-auto">
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
						className="text-white/50 text-sm font-medium mb-4 tracking-widest"
					>
						درباره ما
					</motion.p>
					<motion.h1
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
						className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight mb-6"
					>
						ماهورا
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
						className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed"
					>
						تجربه زیبایی بی‌نظیر با محصولات لوکس اصل
					</motion.p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-6 py-20">
				<div className="divide-y divide-border">
					{values.map((value, i) => (
						<motion.div
							key={value.num}
							initial={{ opacity: 0, y: 28 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{
								duration: 0.55,
								delay: i * 0.07,
								ease: [0.22, 1, 0.36, 1],
							}}
							className={`flex items-start gap-8 py-10 ${i % 2 === 1 ? "pr-10" : ""}`}
						>
							<span
								className="text-5xl font-black leading-none flex-shrink-0 mt-1"
								style={{ color: "var(--accent-gold)" }}
							>
								{value.num}
							</span>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-foreground mb-2">
									{value.title}
								</h2>
								<p className="text-muted-foreground text-base leading-relaxed max-w-md">
									{value.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			<div className="border-t border-border">
				<div className="max-w-4xl mx-auto px-6 py-20 text-center">
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
						className="text-foreground text-lg md:text-xl leading-loose max-w-2xl mx-auto mb-10"
					>
						ماهورا با انتخاب بهترین محصولات آرایشی و بهداشتی، تجربه‌ای منحصربه‌فرد از زیبایی را برای شما به ارمغان می‌آورد.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
					>
						<Link
							href="/products"
							className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105"
							style={{
								background: "var(--accent-gold)",
								color: "#1e0f2a",
							}}
						>
							<span>مشاهده محصولات</span>
							<ArrowLeft className="w-4 h-4" />
						</Link>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

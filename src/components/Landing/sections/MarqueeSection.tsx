"use client";
import { motion } from "framer-motion";

const ITEMS = [
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
];

export default function MarqueeSection() {
	return (
		<div className="bg-accent-gold overflow-hidden py-5 flex items-center no-select">
			<motion.div
				initial={{ x: "50%" }}
				animate={{ x: "0%" }}
				transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
				className="flex flex-row-reverse whitespace-nowrap ltr w-fit"
			>
				{[...Array(2)].map((_, batch) => (
					<div key={batch} className="flex flex-row-reverse items-center">
						{ITEMS.map((item, i) => (
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
	);
}

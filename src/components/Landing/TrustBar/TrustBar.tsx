import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";

const TrustBar = () => {
	const items = [
		{
			icon: ShoppingBag,
			title: "ارسال سریع",
			sub: "تحویل درب منزل در کمترین زمان",
		},
		{
			icon: ShieldCheck,
			title: "تضمین اصالت",
			sub: "مستقیماً از معتبرترین برندها",
		},
		{
			icon: RefreshCcw,
			title: "بازگشت کالا",
			sub: "۷ روز مهلت بررسی و مرجوعی",
		},
		{
			icon: Headphones,
			title: "مشاوره تخصصی",
			sub: "پشتیبانی و مشاوره ۲۴ ساعته",
		},
	];

	return (
		<section className="bg-landing-background py-24 px-6 md:px-14 no-select">
			<div className="max-w-[1300px] mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 relative overflow-hidden rounded-3xl border border-black/[0.03] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
					{items.map((item, i) => {
						const Icon = item.icon;
						return (
							<motion.div
								key={item.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{
									duration: 0.8,
									ease: [0.16, 1, 0.3, 1], // Custom smooth ease
									delay: i * 0.1,
								}}
								whileHover={{ y: -5 }}
								className={`group relative py-12 px-10 flex flex-col items-center text-center gap-5 transition-colors hover:bg-[#FDFCFB] 
                                    ${i !== items.length - 1 ? "lg:border-l border-black/[0.04]" : ""} 
                                    ${i % 2 !== 0 ? "sm:border-l lg:border-l-0" : ""}`} // Responsive border logic
							>
								{/* Subtle Icon Container */}
								<div className="relative">
									<div className="w-14 h-14 rounded-full bg-[#f4f1ee] flex items-center justify-center text-[#2e2420] transition-transform duration-500 group-hover:scale-110">
										<Icon
											strokeWidth={1.2}
											className="w-6 h-6"
										/>
									</div>
									{/* Decorative ring */}
									<div className="absolute inset-0 rounded-full border border-[#c9a875]/0 group-hover:border-[#c9a875]/20 transition-all duration-500 scale-125 group-hover:scale-100" />
								</div>

								<div className="space-y-2">
									<h3 className="font-bold text-sm uppercase tracking-widest text-[#0D0B0A]">
										{item.title}
									</h3>
									<p className="text-[13px] text-[#0D0B0A]/50 font-medium leading-relaxed max-w-[180px]">
										{item.sub}
									</p>
								</div>

								{/* Bottom Indicator Accent */}
								<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#c9a875] transition-all duration-500 group-hover:w-12" />
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default TrustBar;

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";
import SpotlightCard from "@/components/ReactBits/SpotlightCard/SpotlightCard";

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

const TrustBar = () => {
	return (
		<section className="bg-landing-background py-20 px-6 md:px-14 no-select">
			<div className="max-w-[1300px] mx-auto">
				<div className="border border-border shadow-sm rounded-2xl">
					<SpotlightCard
						spotlightColor="rgba(201, 168, 117, 0.25)"
						className="border-0 bg-inherit grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative overflow-hidden rounded-2xl"
					>
						{items.map((item, i) => {
							const Icon = item.icon;
							return (
								<motion.div
									key={item.title}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.7,
										ease: [0.16, 1, 0.3, 1],
										delay: i * 0.08,
									}}
									whileHover={{ y: -3 }}
									className={`group relative py-10 px-8 flex flex-col items-center text-center gap-4 transition-colors duration-300 
									${i !== items.length - 1 ? "lg:border-l border-border" : ""}
									${i >= 2 ? "sm:border-t lg:border-t-0 border-border" : ""}`}
								>
									<div className="relative">
										<div className="w-[52px] h-[52px] rounded-full bg-primary-rose/15 dark:bg-primary-rose/10 flex items-center justify-center text-secondary-plum dark:text-primary-rose transition-transform duration-500 group-hover:scale-110">
											<Icon
												strokeWidth={1.4}
												className="w-6 h-6"
											/>
										</div>
										<div className="absolute inset-0 rounded-full border border-accent-gold/0 group-hover:border-accent-gold/30 transition-all duration-500 scale-[1.3] group-hover:scale-[1.15]" />
									</div>

									<div className="space-y-1.5">
										<h3 className="font-bold text-sm text-foreground">
											{item.title}
										</h3>
										<p className="text-xs text-muted-foreground leading-relaxed max-w-[170px]">
											{item.sub}
										</p>
									</div>

									<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-accent-gold transition-all duration-500 group-hover:w-10 rounded-full" />
								</motion.div>
							);
						})}
					</SpotlightCard>
				</div>
			</div>
		</section>
	);
};

export default TrustBar;

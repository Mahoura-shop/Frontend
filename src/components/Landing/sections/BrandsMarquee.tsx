"use client";
import BackgroundPortraits from "@/components/BackgroundPortraits/BackgroundPortraits";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BrandsMarquee({ brands }: { brands: Brand[] }) {
	if (brands.length === 0) return null;

	const items = [...brands, ...brands];

	return (
		<section className="bg-landing-background py-16 overflow-hidden border-t border-border">
			<div className="mb-10 px-4 md:px-14 max-w-[1300px] mx-auto">
				<div className="flex items-center gap-2.5">
					<div className="w-6 h-px bg-accent-gold" />
					<p className="text-xs font-bold text-accent-gold">برندها</p>
				</div>
			</div>

			<div className="relative flex overflow-hidden ltr">
				<motion.div
					animate={{ x: ["0%", "-50%"] }}
					transition={{
						duration: 30,
						repeat: Infinity,
						ease: "linear",
					}}
					className="flex flex-row-reverse gap-6 shrink-0 py-8 w-fit "
				>
					{items.map((brand, i) => (
						<Link
							key={`${brand.id}-${i}`}
							href={`/brands/${brand.slug}`}
							className="flex-shrink-0 relative w-[100px] h-[100px] rounded-full border border-border bg-card hover:border-accent-gold/40 hover:shadow-[0_4px_24px_rgba(201,168,117,.12)] transition-all duration-300 group overflow-hidden"
						>
							{brand.brandPic ? (
								<img
									src={brand.brandPic}
									alt={brand.name}
									className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
								/>
							) : (
								<span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground/40 group-hover:text-foreground transition-colors duration-300 text-center leading-tight px-2">
									{brand.name}
								</span>
							)}
						</Link>
					))}
				</motion.div>
			</div>
		</section>
	);
}

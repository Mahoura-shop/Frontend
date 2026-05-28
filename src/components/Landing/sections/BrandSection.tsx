"use client";
import { motion } from "framer-motion";
import { Stars } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Magnet from "@/components/utils/Magnet";
import Grainient from "@/components/ReactBits/Grainient/Grainient";

export default function BrandSection() {
	return (
		<>
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
							تجربه‌ای منحصربه‌فرد از زیبایی را برای شما به ارمغان می‌آورد
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
		</>
	);
}

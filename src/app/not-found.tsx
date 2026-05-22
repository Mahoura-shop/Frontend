'use client';

import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

type Particle = { id: number; x: number; y: number; size: number; duration: number; delay: number };

function FloatingParticles() {
	const [particles, setParticles] = useState<Particle[]>([]);

	useEffect(() => {
		setParticles(
			Array.from({ length: 18 }, (_, i) => ({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				size: 2 + Math.random() * 4,
				duration: 4 + Math.random() * 6,
				delay: Math.random() * 4,
			}))
		);
	}, []);

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{particles.map((p) => (
				<motion.div
					key={p.id}
					className="absolute rounded-full bg-primary-rose/20"
					style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
					animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
					transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
				/>
			))}
		</div>
	);
}

function GlitchNumber() {
	const [glitch, setGlitch] = useState(false);

	return (
		<div
			className="relative cursor-default select-none"
			onMouseEnter={() => setGlitch(true)}
			onMouseLeave={() => setGlitch(false)}
		>
			<motion.div
				className="text-[10rem] md:text-[14rem] font-black gradient-text leading-none"
				animate={glitch ? { x: [-2, 2, -1, 1, 0], skewX: [-1, 1, 0] } : {}}
				transition={{ duration: 0.3, ease: 'easeInOut' }}
			>
				۴۰۴
			</motion.div>

			{glitch && (
				<>
					<div
						className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none text-primary-rose/40 select-none"
						style={{ transform: 'translate(3px, -2px)', clipPath: 'inset(30% 0 40% 0)' }}
						aria-hidden
					>
						۴۰۴
					</div>
					<div
						className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none text-secondary-plum/30 select-none"
						style={{ transform: 'translate(-3px, 2px)', clipPath: 'inset(60% 0 10% 0)' }}
						aria-hidden
					>
						۴۰۴
					</div>
				</>
			)}
		</div>
	);
}

export default function NotFound() {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center overflow-hidden" dir="rtl">
			<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/8 via-transparent to-secondary-plum/8 pointer-events-none" />
			<FloatingParticles />

			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-2xl mx-auto text-center">

					<motion.div
						initial={{ opacity: 0, scale: 0.6 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: 'spring', stiffness: 200, damping: 20 }}
						className="mb-4 flex items-center justify-center"
					>
						<GlitchNumber />
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="mb-2"
					>
						<h1 className="text-3xl md:text-4xl font-bold mb-3">صفحه‌ای پیدا نشد</h1>
						<p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
							این صفحه وجود ندارد یا جابجا شده. از منوی اصلی شروع کنید.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.4 }}
						className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
					>
						<Link href="/">
							<Button size="lg" className="gap-2 w-full sm:w-auto">
								<Home className="w-4 h-4" />
								صفحه اصلی
							</Button>
						</Link>
						<Link href="/products">
							<Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
								<Search className="w-4 h-4" />
								جستجوی محصولات
							</Button>
						</Link>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						className="mt-12 flex justify-center gap-2"
					>
						{[0, 1, 2].map((i) => (
							<motion.div
								key={i}
								className="w-2 h-2 rounded-full bg-primary-rose/40"
								animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
								transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
							/>
						))}
					</motion.div>
				</div>
			</div>
		</div>
	);
}

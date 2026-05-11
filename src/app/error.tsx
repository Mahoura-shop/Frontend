'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
			<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/8 via-transparent to-secondary-plum/8 pointer-events-none" />

			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-lg mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: 'spring', stiffness: 200, damping: 20 }}
						className="mb-6"
					>
						<div className="text-8xl font-black gradient-text leading-none mb-4">خطا</div>
						<h1 className="text-2xl font-bold mb-3">مشکلی پیش آمد</h1>
						<p className="text-muted-foreground leading-relaxed">
							یک خطای غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="flex flex-col sm:flex-row gap-3 justify-center"
					>
						<Button size="lg" className="gap-2 w-full sm:w-auto" onClick={reset}>
							<RefreshCw className="w-4 h-4" />
							تلاش مجدد
						</Button>
						<Link href="/">
							<Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
								<Home className="w-4 h-4" />
								صفحه اصلی
							</Button>
						</Link>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

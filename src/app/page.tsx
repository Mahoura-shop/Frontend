"use client";
import { useProductStore } from "@/store/useProductStore";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
	ChevronDown,
	Sparkles,
	ArrowLeft,
	Heart,
	Eye,
	Plus,
	TrendingUp,
	Mail,
	Send,
	CheckCircle,
	Instagram,
	Facebook,
	Twitter,
	Phone,
	Star,
	Package,
	ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Home() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [newsletterSuccess, setNewsletterSuccess] = useState(false);

	const { scrollYProgress } = useScroll();
	const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 100);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleNewsletterSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setNewsletterSuccess(true);
		setTimeout(() => {
			setNewsletterSuccess(false);
			setNewsletterEmail("");
		}, 3000);
	};

	const categories = [
		{
			id: 1,
			name: "آرایش صورت",
			count: 120,
			image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop",
		},
		{
			id: 2,
			name: "مراقبت از پوست",
			count: 85,
			image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
		},
		{
			id: 3,
			name: "عطر و ادکلن",
			count: 45,
			image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=400&fit=crop",
		},
	];

	const featuredProducts = [
		{
			id: 1,
			name: "رژ لب مات",
			brand: "Mahoura Signature",
			price: "۲۹۹,۰۰۰",
			image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
			isNew: true,
			available: true,
		},
		{
			id: 2,
			name: "سرم ویتامین C",
			brand: "Mahoura Care",
			price: "۴۵۰,۰۰۰",
			image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
			isNew: true,
			available: true,
		},
		{
			id: 3,
			name: "پالت سایه",
			brand: "Mahoura Pro",
			price: "۳۵۰,۰۰۰",
			image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400",
			isNew: false,
			available: false,
		},
	];

	const newArrivals = [
		{
			id: 1,
			name: "کرم مرطوب کننده",
			price: "۳۲۰,۰۰۰",
			image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
		},
		{
			id: 2,
			name: "ماسکارا حجم دهنده",
			price: "۲۸۰,۰۰۰",
			image: "https://images.unsplash.com/photo-1631214460245-0e9b29740c17?w=400",
		},
		{
			id: 3,
			name: "هایلایتر طلایی",
			price: "۳۸۰,۰۰۰",
			image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
		},
		{
			id: 4,
			name: "اسپری تثبیت کننده",
			price: "۲۵۰,۰۰۰",
			image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400",
		},
	];

	return (
		<div className="min-h-screen overflow-x-hidden">
			{/* Navigation */}
			<motion.nav
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					isScrolled
						? "bg-background/80 backdrop-blur-lg shadow-lg"
						: "bg-transparent"
				}`}
			>
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, type: "spring" }}
						className="text-3xl font-bold gradient-text"
					>
						Mahoura
					</motion.div>

					<div className="hidden md:flex items-center gap-8">
						{[
							"محصولات",
							"دسته‌بندی‌ها",
							"برندها",
							"تماس با ما",
						].map((item, i) => (
							<motion.a
								key={item}
								href="/products"
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 + i * 0.1 }}
								className="text-foreground hover:text-primary transition-colors relative group"
							>
								{item}
								<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-rose to-accent-gold transition-all group-hover:w-full" />
							</motion.a>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.6 }}
						className="flex items-center gap-4"
					>
						<Button
							variant="ghost"
							size="icon"
							className="relative"
						>
							<Heart className="w-5 h-5" />
							<span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-rose rounded-full text-xs flex items-center justify-center text-white">
								3
							</span>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="relative"
						>
							<ShoppingBag className="w-5 h-5" />
							<span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-rose rounded-full text-xs flex items-center justify-center text-white">
								2
							</span>
						</Button>
					</motion.div>
				</div>
			</motion.nav>

			{/* Hero Section */}
			<section className="relative h-screen overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20">
					<div className="absolute inset-0 opacity-30">
						{typeof window !== "undefined" &&
							[...Array(20)].map((_, i) => (
								<motion.div
									key={i}
									className="absolute w-2 h-2 bg-primary-rose rounded-full"
									initial={{
										x: Math.random() * window.innerWidth,
										y: Math.random() * window.innerHeight,
									}}
									animate={{
										y: [0, -30, 0],
										x: [0, Math.random() * 50 - 25, 0],
										opacity: [0.3, 0.8, 0.3],
									}}
									transition={{
										duration: 3 + Math.random() * 2,
										repeat: Infinity,
										delay: Math.random() * 2,
									}}
								/>
							))}
					</div>
				</div>

				<div className="container mx-auto px-4 h-full flex items-center relative z-10">
					<div className="grid md:grid-cols-2 gap-12 items-center w-full">
						<motion.div style={{ opacity }} className="space-y-6">
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.8, duration: 0.8 }}
							>
								<h1 className="text-6xl md:text-7xl font-bold leading-tight">
									{["تجربه", "زیبایی", "بی‌نظیر"].map(
										(word, i) => (
											<motion.span
												key={word}
												className="inline-block gradient-text"
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													delay: 1 + i * 0.2,
													type: "spring",
												}}
											>
												{word}{" "}
											</motion.span>
										),
									)}
								</h1>
							</motion.div>

							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 1.6 }}
								className="text-xl text-muted-foreground max-w-lg"
							>
								با محصولات لوکس آرایشی و بهداشتی ماهورا، زیبایی
								خود را به سطحی نو ببرید
							</motion.p>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1.8 }}
								className="flex gap-4"
							>
								<Button
									variant="luxury"
									size="lg"
									className="group"
								>
									<span className="flex items-center gap-2">
										کشف محصولات
										<ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
									</span>
								</Button>
								<Button variant="outline" size="lg">
									درباره ما
								</Button>
							</motion.div>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 2 }}
								className="flex gap-8 pt-8"
							>
								{[
									{ label: "محصولات", value: "۲۵۰+" },
									{ label: "برندها", value: "۵۰+" },
									{ label: "مشتریان راضی", value: "۱۰۰۰+" },
								].map((stat, i) => (
									<div
										key={stat.label}
										className="text-center"
									>
										<motion.div
											className="text-3xl font-bold gradient-text"
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{
												delay: 2.2 + i * 0.1,
												type: "spring",
											}}
										>
											{stat.value}
										</motion.div>
										<div className="text-sm text-muted-foreground">
											{stat.label}
										</div>
									</div>
								))}
							</motion.div>
						</motion.div>

						<motion.div
							style={{ scale }}
							className="relative h-[600px] hidden md:block"
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 1, duration: 1 }}
								className="relative h-full rounded-3xl overflow-hidden shadow-2xl"
							>
								<img
									src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=1000&fit=crop"
									alt="Mahoura Products"
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-primary-rose/30 to-transparent" />

								{[...Array(5)].map((_, i) => (
									<motion.div
										key={i}
										className="absolute"
										style={{
											left: `${20 + i * 20}%`,
											top: `${30 + i * 10}%`,
										}}
										animate={{
											y: [0, -20, 0],
											opacity: [0, 1, 0],
											scale: [0.8, 1.2, 0.8],
										}}
										transition={{
											duration: 2,
											repeat: Infinity,
											delay: i * 0.4,
										}}
									>
										<Sparkles className="w-6 h-6 text-accent-gold" />
									</motion.div>
								))}
							</motion.div>
						</motion.div>
					</div>
				</div>

				<motion.div
					className="absolute bottom-8 left-1/2 -translate-x-1/2"
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 1.5, repeat: Infinity }}
				>
					<ChevronDown className="w-8 h-8 text-primary" />
				</motion.div>
			</section>

			{/* Categories */}
			<section className="py-24 relative">
				<div className="absolute inset-0 bg-neutral-warm dark:bg-background" />

				<div className="container mx-auto px-4 relative z-10">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-5xl font-bold text-center mb-16 gradient-text"
					>
						دسته‌بندی محصولات
					</motion.h2>

					<div className="grid md:grid-cols-3 gap-8">
						{categories.map((category, i) => (
							<motion.div
								key={category.id}
								initial={{
									opacity: 0,
									x: i === 0 ? 100 : i === 1 ? -100 : 0,
									y: i === 2 ? 100 : 0,
								}}
								whileInView={{ opacity: 1, x: 0, y: 0 }}
								viewport={{ once: true }}
								transition={{
									delay: i * 0.2,
									type: "spring",
									stiffness: 100,
								}}
								whileHover={{
									y: -12,
									transition: {
										type: "spring",
										stiffness: 400,
									},
								}}
								className="group relative"
							>
								<Card className="overflow-hidden border-2 hover:border-primary-rose transition-all duration-300 card-3d">
									<div className="relative h-64 overflow-hidden">
										<motion.img
											src={category.image}
											alt={category.name}
											className="w-full h-full object-cover"
											whileHover={{ scale: 1.1 }}
											transition={{ duration: 0.4 }}
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

										<motion.div className="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

										<div className="absolute bottom-4 left-4 right-4">
											<h3 className="text-2xl font-bold text-white mb-2">
												{category.name}
											</h3>
											<Badge
												variant="secondary"
												className="mb-3"
											>
												<Package className="w-3 h-3 ml-1" />
												{category.count} محصول
											</Badge>
											<Button
												variant="ghost"
												className="w-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 group"
											>
												مشاهده همه
												<motion.div
													animate={{ x: [0, -5, 0] }}
													transition={{
														duration: 1,
														repeat: Infinity,
													}}
												>
													<ArrowLeft className="w-4 h-4 mr-2" />
												</motion.div>
											</Button>
										</div>
									</div>

									<motion.div
										className="absolute top-4 left-4"
										animate={{ y: [0, -8, 0] }}
										transition={{
											duration: 3,
											repeat: Infinity,
											ease: "easeInOut",
										}}
									>
										<Sparkles className="w-6 h-6 text-accent-gold opacity-80" />
									</motion.div>
								</Card>

								<div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none rounded-lg" />
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="py-24 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-secondary-plum/5 via-transparent to-primary-rose/5" />

				<div className="container mx-auto px-4 relative z-10">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-5xl font-bold gradient-text mb-4">
							محصولات ویژه
						</h2>
						<p className="text-muted-foreground text-lg">
							برترین انتخاب‌های ما برای شما
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						{featuredProducts.map((product, i) => (
							<motion.div
								key={product.id}
								initial={{ opacity: 0, y: 50, scale: 0.9 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.15 }}
								className="group"
							>
								<Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 relative">
									{product.isNew && (
										<Badge
											variant="new"
											className="absolute top-4 right-4 z-10"
										>
											<Star className="w-3 h-3 ml-1" />
											جدید
										</Badge>
									)}

									<div className="relative h-80 overflow-hidden">
										<motion.img
											src={product.image}
											alt={product.name}
											className="w-full h-full object-cover"
											whileHover={{ scale: 1.1 }}
											transition={{ duration: 0.4 }}
										/>

										<motion.div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<Button
												size="icon"
												variant="secondary"
												className="rounded-full"
											>
												<Eye className="w-5 h-5" />
											</Button>
											<Button
												size="icon"
												variant="secondary"
												className="rounded-full"
											>
												<Heart className="w-5 h-5" />
											</Button>
										</motion.div>
									</div>

									<CardContent className="p-6">
										<p className="text-sm text-muted-foreground mb-2">
											{product.brand}
										</p>
										<h3 className="text-xl font-bold mb-3">
											{product.name}
										</h3>

										<div className="flex items-center justify-between">
											<div>
												<motion.span
													className="text-2xl font-bold gradient-text"
													whileHover={{ scale: 1.1 }}
												>
													{product.price}
												</motion.span>
												<span className="text-sm text-muted-foreground mr-2">
													تومان
												</span>
											</div>

											<Badge
												variant={
													product.available
														? "available"
														: "outOfStock"
												}
											>
												{product.available
													? "موجود"
													: "ناموجود"}
											</Badge>
										</div>

										<Button
											variant="luxury"
											className="w-full mt-4"
											disabled={!product.available}
										>
											افزودن به سبد خرید
										</Button>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* New Arrivals - Bento Grid */}
			<section className="py-24 bg-neutral-warm dark:bg-background">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<Badge variant="new" className="mb-4">
							<TrendingUp className="w-4 h-4 ml-1" />
							تازه‌ها
						</Badge>
						<h2 className="text-5xl font-bold gradient-text">
							جدیدترین محصولات
						</h2>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{newArrivals.map((product, i) => (
							<motion.div
								key={product.id}
								initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
								whileInView={{
									opacity: 1,
									scale: 1,
									rotate: 0,
								}}
								viewport={{ once: true }}
								transition={{ delay: i * 0.08 }}
								whileHover={{ y: -8, scale: 1.02 }}
								className="group"
							>
								<Card className="overflow-hidden relative border-2 border-transparent hover:border-gradient-to-r hover:from-primary-rose hover:to-accent-gold">
									<div className="relative h-64 overflow-hidden">
										<motion.img
											src={product.image}
											alt={product.name}
											className="w-full h-full object-cover"
											whileHover={{ scale: 1.1 }}
										/>
										<Badge
											variant="new"
											className="absolute top-3 right-3 animate-bounce"
										>
											NEW
										</Badge>
									</div>
									<CardContent className="p-4">
										<h3 className="font-bold mb-2">
											{product.name}
										</h3>
										<p className="text-lg gradient-text font-bold">
											{product.price} تومان
										</p>
									</CardContent>

									<div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-primary-rose to-accent-gold opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Newsletter */}
			{/* <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-plum/20 via-primary-rose/10 to-accent-gold/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-5xl font-bold gradient-text mb-4">به جمع ما بپیوندید</h2>
            <p className="text-muted-foreground text-lg mb-8">
              برای دریافت جدیدترین محصولات و پیشنهادات ویژه ایمیل خود را وارد کنید
            </p>

            {newsletterSuccess ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-emerald-500/20 border-2 border-emerald-500 rounded-lg p-8"
              >
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <p className="text-xl font-bold">عضویت شما با موفقیت انجام شد!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" variant="luxury" size="lg">
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            )}

            {[...Array(4)].map((_, i) => (
              <motion.img
                key={i}
                src={`https://images.unsplash.com/photo-${[1596462502278, 1620916566398, 1522335789203, 1512496015851][i]}-27bfdc403348?w=200&h=200&fit=crop`}
                alt=""
                className="absolute w-32 h-32 rounded-full object-cover opacity-20"
                style={{
                  left: `${10 + i * 25}%`,
                  top: `${20 + (i % 2) * 60}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut" */}
		</div>
	);
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ShoppingBag,
	Sparkles,
	Star,
	Heart,
	Eye,
	ChevronLeft,
	ChevronRight,
	ArrowLeft,
	FolderTree,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProductStore } from "@/store/useProductStore";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { getData } from "@/services/services";
import { useCategoryStore } from "@/store/useCategoryStore";

export default function LandingPage() {
	const { products } = useProductStore();
	const { categories, fetchCategories } = useCategoryStore();
	const [categoryIndices, setCategoryIndices] = useState([0, 1, 2]);
	const [featuredIndices, setFeaturedIndices] = useState([0, 1, 2]);
	const [newIndices, setNewIndices] = useState([0, 1, 2]);

	const [brandsCount, setBrandsCount] = useState<number>(0);
	const [categoriesCount, setCategoriesCount] = useState<number>(0);
	const [productsCount, setProductsCount] = useState<number>(0);
	const fetchSiteData = () => {
		getData({ endPoint: `/v1/admin/dashboard` }).then((data) => {
			setProductsCount(data?.data?.productsCount);
			setBrandsCount(data?.data?.brandsCount);
			setCategoriesCount(data?.data?.categoriesCount);
		});
	};
	useEffect(() => {
		fetchSiteData();
		fetchCategories();
	}, []);

	// const categories = [
	// 	{
	// 		id: 1,
	// 		name: "آرایش صورت",
	// 		image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop",
	// 		count: 120,
	// 		description: "محصولات آرایشی حرفه‌ای",
	// 	},
	// 	{
	// 		id: 2,
	// 		name: "مراقبت از پوست",
	// 		image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop",
	// 		count: 85,
	// 		description: "مراقبت تخصصی از پوست",
	// 	},
	// 	{
	// 		id: 3,
	// 		name: "آرایش چشم",
	// 		image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop",
	// 		count: 65,
	// 		description: "محصولات آرایش چشم",
	// 	},
	// 	{
	// 		id: 4,
	// 		name: "عطر و ادکلن",
	// 		image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop",
	// 		count: 45,
	// 		description: "عطرهای لوکس و ماندگار",
	// 	},
	// 	{
	// 		id: 5,
	// 		name: "عطر و ادکلن 2",
	// 		image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop",
	// 		count: 45,
	// 		description: "عطرهای لوکس و ماندگار",
	// 	},
	// 	{
	// 		id: 6,
	// 		name: "عطر و ادکلن 3",
	// 		image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop",
	// 		count: 41,
	// 		description: "عطرهای لوکس و ماندگار اووووو",
	// 	},
	// 	{
	// 		id: 7,
	// 		name: "عطر و ادکلن 4",
	// 		image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop",
	// 		count: 450,
	// 		description: "عطرهای لوکس و ماندگار مییو",
	// 	},
	// ];

	const newProducts = products.filter((p) => p.isNew).slice(0, 6);

	const CategoryCard = ({ category }: { category: Category }) => (
		<Link href={`/products`}>
			<Card
				className={`group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300`}
			>
				<div className="relative h-80 bg-muted flex items-center justify-center overflow-hidden">
				{/* <div className="relative h-80 overflow-hidden"> */}
					{category.categoryPic ? (
						<img
							src={category.categoryPic}
							alt={category.name}
							className="w-full h-full object-cover"
						/>
					) : (
						<FolderTree className="w-16 h-16 text-muted-foreground" />
					)}
					{/* <img
						src={category.categoryPic}
						alt={category.name}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/> */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent" />
					<div className="absolute inset-0 bg-primary-rose/0 group-hover:bg-primary-rose/10 transition-colors duration-300" />

					<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
						<div className="flex items-end justify-between">
							<div>
								<h3 className="text-2xl font-bold mb-2">
									{category.name}
								</h3>
								<p className="text-white/90 mb-3">
									{category.description}
								</p>
							</div>
							<ArrowLeft className="w-5 h-5 transform group-hover:translate-x-[-8px] transition-transform" />
						</div>
						{/* <div className="flex items-end justify-between">
							<Badge
								variant="secondary"
								className="bg-white/20 text-white"
							>
								{category.name}
							</Badge>
							<ArrowLeft className="w-5 h-5 transform group-hover:translate-x-[-8px] transition-transform" />
						</div> */}
					</div>
				</div>
			</Card>
		</Link>
	);

	const ProductCard = ({ product }: { product: Product }) => (
		<Card className="group overflow-hidden hover:shadow-xl transition-all">
			<div className="relative h-80 overflow-hidden">
				<img
					src={product.productPic}
					alt={product.name}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
				<div className="absolute top-4 right-4 flex flex-col gap-2">
					{product.isNew && (
						<Badge variant="new">
							<Star className="w-3 h-3 ml-1" />
							جدید
						</Badge>
					)}
					{/* {!product.available && (
						<Badge variant="outOfStock">ناموجود</Badge>
					)} */}
				</div>
			</div>

			<CardContent className="p-6">
				<p className="text-sm text-muted-foreground mb-1">
					{product?.brand?.name}
				</p>
				<Link href={`/products/${product.id}`}>
					<h3 className="text-xl font-bold mb-2 transition-colors">
						{product.name}
					</h3>
				</Link>

				<Badge>{product?.category?.name}</Badge>

				<div className="flex place-content-end">
					<div>
						<span className="text-2xl font-bold text-primary-rose">
							{product.price}
						</span>
						<span className="text-sm text-muted-foreground mr-2">
							تومان
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
				<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20" />

				<div className="container mx-auto px-4 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center max-w-4xl mx-auto"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2, duration: 0.8 }}
							className="mb-8"
						>
							<h1 className="text-6xl md:text-8xl font-bold mb-6">
								<span className="gradient-text">ماهورا</span>
							</h1>
							<p className="text-2xl md:text-3xl text-muted-foreground mb-4">
								تجربه زیبایی بی‌نظیر
							</p>
							<p className="text-lg md:text-xl text-muted-foreground">
								محصولات آرایشی و بهداشتی لوکس با بالاترین کیفیت
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="flex items-center justify-center gap-4 flex-wrap"
						>
							<Link href="/products">
								<Button
									size="lg"
									variant="luxury"
									className="gap-2 text-lg px-8 py-6"
								>
									<ShoppingBag className="w-5 h-5" />
									مشاهده محصولات
								</Button>
							</Link>
							<Link href="/about">
								<Button
									size="lg"
									variant="outline"
									className="text-lg px-8 py-6"
								>
									درباره ما
								</Button>
							</Link>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1 }}
							className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
						>
							{[
								{
									value: new Intl.NumberFormat(
										"fa-IR",
									).format(productsCount),
									label: "محصول",
								},
								{
									value: new Intl.NumberFormat(
										"fa-IR",
									).format(brandsCount),
									label: "برند",
								},
								{ value: "۱۰۰+", label: "مشتری راضی" },
							].map((stat, i) => (
								<motion.div
									key={stat.label}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{
										delay: 1.2 + i * 0.1,
										type: "spring",
									}}
									className="text-center"
								>
									<div className="text-3xl font-bold gradient-text">
										{stat.value}
									</div>
									<div className="text-sm text-muted-foreground mt-1">
										{stat.label}
									</div>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</div>

				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ repeat: Infinity, duration: 1.5 }}
					className="absolute bottom-8 left-1/2 -translate-x-1/2"
				>
					<div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
						<div className="w-1 h-2 bg-foreground/30 rounded-full" />
					</div>
				</motion.div>
			</section>

			{/* Categories Carousel */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
							دسته‌بندی محصولات
						</h2>
						<p className="text-muted-foreground text-lg">
							محصولات متنوع برای هر نیاز زیبایی شما
						</p>
					</motion.div>

					<Carousel
						opts={{
							align: "start",
							loop: true,
							direction: "rtl",
						}}
						className="w-full"
					>
						<CarouselContent>
							{categories.map((category) => (
								<CarouselItem
									key={category.id}
									className="lg:basis-1/3 md:basis-2"
								>
									<CategoryCard category={category} />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</div>
			</section>

			{/* Featured Products Carousel */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
							محصولات ویژه
						</h2>
						<p className="text-muted-foreground text-lg">
							منتخب بهترین محصولات برای شما
						</p>
					</motion.div>
					<Carousel
						opts={{
							align: "start",
							loop: true,
							direction: "rtl",
						}}
						className="w-full"
					>
						<CarouselContent>
							{products.map((product) => (
								<CarouselItem
									key={product.id}
									className="lg:basis-1/3 md:basis-2"
								>
									<ProductCard product={product} />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</div>
			</section>

			{/* New Products Carousel */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
							جدیدترین محصولات
						</h2>
						<p className="text-muted-foreground text-lg">
							تازه‌ترین محصولات اضافه شده به مجموعه ما
						</p>
					</motion.div>

					<Carousel
						opts={{
							align: "start",
							loop: true,
							direction: "rtl",
						}}
						className="w-full"
					>
						<CarouselContent>
							{newProducts.map((product) => (
								<CarouselItem
									key={product.id}
									className="lg:basis-1/3 md:basis-2"
								>
									<ProductCard product={product} />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>

					<div className="text-center mt-12">
						<Link href="/products">
							<Button size="lg" variant="luxury">
								مشاهده همه محصولات
								<ArrowLeft className="w-5 h-5 mr-2" />
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}

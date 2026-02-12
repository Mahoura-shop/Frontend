"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
	Heart,
	ShoppingBag,
	Star,
	Filter,
	Search,
	Grid3x3,
	List,
	SlidersHorizontal,
	X,
	Eye,
	Package,
	ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/useProductStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

export default function ProductsPage() {
	const { products, getProducts } = useProductStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [priceRange, setPriceRange] = useState<
		"all" | "low" | "mid" | "high"
	>("all");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showFilters, setShowFilters] = useState(false);
	const [sortBy, setSortBy] = useState<string>("newest");

	useEffect(() => {
		console.log("products", products);
		getProducts();
	}, []);
	const categories = [
		"all",
		"آرایش صورت",
		"مراقبت از پوست",
		"آرایش چشم",
		"عطر و ادکلن",
	];

	return (
		<div className="min-h-screen bg-background">
			<div className="">
				{/* Header */}
				<div className="bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20 py-16">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center"
						>
							<h1 className="text-5xl font-bold gradient-text mb-4">
								تمامی محصولات
							</h1>
							<p className="text-muted-foreground text-lg">
								{products.length} محصول موجود
							</p>
						</motion.div>
					</div>
				</div>

				<div className="container mx-auto px-4 py-12">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Filters Sidebar */}
						<motion.aside
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
						>
							<Card className="sticky top-24">
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-6">
										<h3 className="text-xl font-bold flex items-center gap-2">
											<Filter className="w-5 h-5" />
											فیلترها
										</h3>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												setShowFilters(false)
											}
											className="lg:hidden"
										>
											<X className="w-5 h-5" />
										</Button>
									</div>

									{/* Search */}
									{/* <div className="mb-6">
										<label className="text-sm font-medium mb-2 block">
											جستجو
										</label>
										<div className="relative">
											<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
											<Input
												placeholder="نام محصول یا برند..."
												value={searchQuery}
												onChange={(e) =>
													setSearchQuery(
														e.target.value,
													)
												}
												className="pr-10"
											/>
										</div>
									</div> */}

									{/* Categories */}
									<div className="mb-6">
										<label className="text-sm font-medium mb-3 block">
											دسته‌بندی
										</label>
										<div className="space-y-2">
											{categories.map((cat) => (
												<button
													key={cat}
													onClick={() =>
														setSelectedCategory(cat)
													}
													className={`w-full text-right px-4 py-2 rounded-lg transition-all ${
														selectedCategory === cat
															? "bg-gradient-to-r from-primary-rose to-secondary-plum text-white"
															: "hover:bg-muted"
													}`}
												>
													{cat === "all"
														? "همه محصولات"
														: cat}
												</button>
											))}
										</div>
									</div>

									{/* Price Range */}
									<div className="mb-6">
										<label className="text-sm font-medium mb-3 block">
											محدوده قیمت
										</label>
										<div className="space-y-2">
											{[
												{
													value: "all",
													label: "همه قیمت‌ها",
												},
												{
													value: "low",
													label: "زیر ۳۰۰,۰۰۰ تومان",
												},
												{
													value: "mid",
													label: "۳۰۰,۰۰۰ - ۴۰۰,۰۰۰ تومان",
												},
												{
													value: "high",
													label: "بالای ۴۰۰,۰۰۰ تومان",
												},
											].map((range) => (
												<button
													key={range.value}
													onClick={() =>
														setPriceRange(
															range.value as any,
														)
													}
													className={`w-full text-right px-4 py-2 rounded-lg transition-all text-sm ${
														priceRange ===
														range.value
															? "bg-accent-gold text-white"
															: "hover:bg-muted"
													}`}
												>
													{range.label}
												</button>
											))}
										</div>
									</div>

									{/* Clear Filters */}
									<Button
										variant="outline"
										className="w-full"
										onClick={() => {
											setSearchQuery("");
											setSelectedCategory("all");
											setPriceRange("all");
										}}
									>
										پاک کردن فیلترها
									</Button>
								</CardContent>
							</Card>
						</motion.aside>

						{/* Products Grid */}
						<div className="flex-1">
							{/* Toolbar */}
							<div className="flex items-center justify-between mb-8 flex-wrap gap-4">
								<div className="flex items-center gap-4 justify-between w-full">
									{/* <Button
										variant="outline"
										className="lg:hidden"
										onClick={() =>
											setShowFilters(!showFilters)
										}
									>
										<SlidersHorizontal className="w-5 h-5 ml-2" />
										فیلترها
									</Button> */}

									<div className="relative w-full">
										<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
										<Input
											placeholder="نام محصول یا برند..."
											value={searchQuery}
											onChange={(e) =>
												setSearchQuery(e.target.value)
											}
											className="pr-10"
										/>
									</div>
									<Select
										value={sortBy}
										onValueChange={(e) => setSortBy(e)}
									>
										<SelectTrigger className="py-2 border rounded-lg bg-background text-foreground w-48">
											<SelectValue placeholder="مرتب سازی" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>
													مرتب سازی بر اساس
												</SelectLabel>
												<SelectItem value="newest">
													جدیدترین
												</SelectItem>
												<SelectItem value="popular">
													محبوب‌ترین
												</SelectItem>
												<SelectItem value="price-low">
													ارزان‌ترین
												</SelectItem>
												<SelectItem value="price-high">
													گران‌ترین
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>

								{/* <div className="flex items-center gap-2">
									<Button
										variant={
											viewMode === "grid"
												? "default"
												: "ghost"
										}
										size="icon"
										onClick={() => setViewMode("grid")}
									>
										<Grid3x3 className="w-5 h-5" />
									</Button>
									<Button
										variant={
											viewMode === "list"
												? "default"
												: "ghost"
										}
										size="icon"
										onClick={() => setViewMode("list")}
									>
										<List className="w-5 h-5" />
									</Button>
								</div> */}
							</div>

							{/* Products */}
							{products && products?.length === 0 ? (
								<div className="text-center py-20">
									<Package className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
									<h3 className="text-2xl font-bold mb-2">
										محصولی یافت نشد
									</h3>
									<p className="text-muted-foreground">
										فیلترهای خود را تغییر دهید
									</p>
								</div>
							) : (
								<div
									className={
										viewMode === "grid"
											? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
											: "space-y-6"
									}
								>
									{products &&
										products?.map((product, i) => (
											<motion.div
												key={i}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: i * 0.05 }}
											>
												<Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 min-h-[400px]">
													<div className="relative">
														<Link
															href={`/products/${product.id}`}
														>
															<div
																className={`relative h-60 bg-muted overflow-hidden cursor-pointer flex place-items-center place-content-center`}
															>
																{product.productPic ? (
																	<motion.img
																		src={
																			product.productPic
																		}
																		alt={
																			product.name
																		}
																		className="w-full h-full object-cover"
																		whileHover={{
																			scale: 1.1,
																		}}
																		transition={{
																			duration: 0.3,
																		}}
																	/>
																) : (
																	<ImageIcon className="w-16 h-16 text-muted-foreground" />
																)}
																{/* <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" /> */}
															</div>
														</Link>

														<div className="absolute top-4 right-4 flex flex-col gap-2">
															{product.isNew && (
																<Badge variant="new">
																	<Star className="w-3 h-3 ml-1" />
																	جدید
																</Badge>
															)}
															{product.quantity ==
																0 && (
																<Badge variant="outOfStock">
																	ناموجود
																</Badge>
															)}
														</div>

														{/* <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
														<Button
															size="icon"
															variant="secondary"
															className="rounded-full"
															onClick={() =>
																toggleWishlist(
																	product.id,
																)
															}
														>
															<Heart
																className={`w-5 h-5 ${
																	wishlist.includes(
																		product.id,
																	)
																		? "fill-red-500 text-red-500"
																		: ""
																}`}
															/>
														</Button>
														<Link
															href={`/products/${product.id}`}
														>
															<Button
																size="icon"
																variant="secondary"
																className="rounded-full"
															>
																<Eye className="w-5 h-5" />
															</Button>
														</Link>
													</div> */}
													</div>

													<CardContent className="py-4 px-6">
														<p className="text-sm text-muted-foreground mb-1">
															{
																product.brand
																	?.name
															}
														</p>
														<Link
															href={`/products/${product.id}`}
														>
															<h3 className="text-xl font-bold mb-2 transition-colors cursor-pointer text-foreground">
																{product?.name}
															</h3>
														</Link>

														{/* {product.rating && (
														<div className="flex items-center gap-2 mb-3">
															<div className="flex">
																{[
																	...Array(5),
																].map(
																	(_, i) => (
																		<Star
																			key={
																				i
																			}
																			className={`w-4 h-4 ${
																				i <
																				Math.floor(
																					product.rating!,
																				)
																					? "fill-amber-500 text-amber-500"
																					: "text-gray-300"
																			}`}
																		/>
																	),
																)}
															</div>
															<span className="text-sm text-muted-foreground">
																(
																{
																	product.reviews
																}{" "}
																نظر)
															</span>
														</div>
													)} */}
														{product.category
															?.name && (
															<Badge className="inline-flex place-content-center place-items-center justify-center">
																{
																	product
																		.category
																		?.name
																}
															</Badge>
														)}

														<div className="flex place-content-end">
															<div>
																<motion.span
																	className="text-2xl font-bold text-primary-rose"
																	whileHover={{
																		scale: 1.05,
																	}}
																>
																	{
																		product.price
																	}
																</motion.span>
																<span className="text-sm text-muted-foreground mr-2">
																	تومان
																</span>
															</div>
														</div>

														{/* <div className="flex gap-2">
														<Button
															variant="luxury"
															className="flex-1"
															disabled={
																!product.available
															}
															onClick={() =>
																handleAddToCart(
																	product,
																)
															}
														>
															<ShoppingBag className="w-4 h-4 ml-2" />
															افزودن به سبد
														</Button>
													</div> */}
													</CardContent>
												</Card>
											</motion.div>
										))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

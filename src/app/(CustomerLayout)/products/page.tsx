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
// import { Input } from "@/components/ui/input";
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
import { useCategoryStore } from "@/store/useCategoryStore";
import { useBrandStore } from "@/store/useBrandStore";
import Input from "@/components/Custom/Input/Input";
import { Slider } from "@/components/ui/slider";
import { Pagination } from "@/components/ui/pagination";

export default function ProductsPage() {
	const { products, fetchProducts } = useProductStore();
	const { categories, fetchCategories } = useCategoryStore();
	const { brands, fetchBrands } = useBrandStore();
	// const { products, getProducts } = useProductStore();
	const itemsPerPage = 12;
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<number>(0);
	const [selectedBrand, setSelectedBrand] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [priceRange, setPriceRange] = useState<number[]>([1000, 100000]);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showFilters, setShowFilters] = useState(false);
	const [sortBy, setSortBy] = useState<string>("newest");

	const filteredProducts = products
		.filter(
			(product: Product) =>
				Number(product.categoryID) === selectedCategory ||
				selectedCategory === 0,
		)
		.filter(
			(product: Product) =>
				Number(product.brandID) === selectedBrand ||
				selectedBrand === 0,
		)
		.filter(
			(product: Product) =>
				product.name.includes(searchQuery) || searchQuery === "",
		)
		.filter(
			(product: Product) =>
				Number(product.irrPrice) >= priceRange[0] &&
				Number(product.irrPrice) <= priceRange[1],
		)
		.sort((a: Product, b: Product) => {
			switch (sortBy) {
				case "newest":
					return b.id - a.id;

				case "price-low":
					return (
						(Number(a.irrPrice) || 0) - (Number(b.irrPrice) || 0)
					);

				case "price-high":
					return (
						(Number(b.irrPrice) || 0) - (Number(a.irrPrice) || 0)
					);

				default:
					return 0;
			}
		});
	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
	const paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);
	const handlePriceChange = (values: number[]) => {
		// Values are now automatically sorted [min, max]
		setPriceRange(values);
	};

	const prices = products?.map(
		(product: Product) =>
			Math.round(Number(product.irrPrice) / 1000) * 1000,
	);

	useEffect(() => {
		fetchCategories();
		fetchBrands();
		fetchProducts().then((data) => {
			const prices = data?.map(
				(product: Product) =>
					Math.round(Number(product.irrPrice) / 1000) * 1000,
			);
			setPriceRange([Math.min(...prices), Math.max(...prices)]);
		});
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, sortBy, selectedCategory, selectedBrand, priceRange]);

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
								<CardContent className="flex flex-col gap-6 p-6">
									<div className="flex items-center justify-between">
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
									<div className="">
										<label className="text-sm font-medium mb-3 block">
											دسته‌بندی
										</label>
										<div className="space-y-2">
											{[
												{
													id: 0,
													name: "تمام دسته‌بندی‌ها",
												},
												...categories,
											].map((cat) => (
												<button
													key={cat.id}
													onClick={() =>
														setSelectedCategory(
															cat.id,
														)
													}
													className={`w-full text-right px-4 py-2 rounded-lg transition-all ${
														selectedCategory ===
														cat.id
															? "bg-gradient-to-r from-primary-rose to-secondary-plum text-white"
															: "hover:bg-muted"
													}`}
												>
													{cat.name}
												</button>
											))}
										</div>
									</div>

									{/* Brands */}
									<div className="">
										<label className="text-sm font-medium mb-3 block">
											برند
										</label>
										<div className="space-y-2">
											{[
												{ id: 0, name: "تمام برندها" },
												...brands,
											].map((brand) => (
												<button
													key={brand.id}
													onClick={() =>
														setSelectedBrand(
															brand.id,
														)
													}
													className={`w-full text-right px-4 py-2 rounded-lg transition-all ${
														selectedBrand ===
														brand.id
															? "bg-gradient-to-r from-primary-rose to-secondary-plum text-white"
															: "hover:bg-muted"
													}`}
												>
													{brand.name}
												</button>
											))}
										</div>
									</div>

									{/* Price Range */}
									{/* <Slider
										value={priceRange}
										onValueChange={setPriceRange}
										max={100000}
										step={1000}
										min={0}
										className="w-full"
									/> */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">
												محدوده قیمت
											</span>
											{/* <span className="text-sm text-muted-foreground">
												{new Intl.NumberFormat(
													"fa-IR",
												).format(priceRange[1])}{" "}
												-{" "}
												{new Intl.NumberFormat(
													"fa-IR",
												).format(priceRange[0])}{" "}
												تومان
											</span> */}
										</div>

										<Slider
											value={priceRange}
											onValueChange={handlePriceChange}
											max={Math.max(...prices)}
											min={Math.min(...prices)}
											step={1000}
										/>

										<div className="grid grid-cols-2 gap-4">
											<div className="p-3 rounded-lg bg-background border text-center">
												<p className="text-xs text-muted-foreground mb-1">
													حداکثر
												</p>
												<p className="font-bold gradient-text">
													{new Intl.NumberFormat(
														"fa-IR",
													).format(priceRange[1])}
												</p>
												<p className="font-bold gradient-text">
													تومان
												</p>
											</div>
											<div className="p-3 rounded-lg bg-background border text-center">
												<p className="text-xs text-muted-foreground mb-1">
													حداقل
												</p>
												<p className="font-bold gradient-text">
													{new Intl.NumberFormat(
														"fa-IR",
													).format(priceRange[0])}
												</p>
												<p className="font-bold gradient-text">
													تومان
												</p>
											</div>
										</div>
									</div>

									{/* Clear Filters */}
									<Button
										variant="outline"
										className="w-full"
										onClick={() => {
											setSearchQuery("");
											setSelectedCategory(0);
											setPriceRange([
												Math.min(...prices),
												Math.max(...prices),
											]);
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
											label="نام محصول یا برند..."
											// placeholder="نام محصول یا برند..."
											icon={Search}
											value={searchQuery}
											// onChange={(e) =>
											// 	setSearchQuery(e.target.value)
											// }
											onValueChange={(value) => {
												setSearchQuery(value);
											}}
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
												{/* <SelectItem value="popular">
													محبوب‌ترین
												</SelectItem> */}
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
							{paginatedProducts &&
							paginatedProducts?.length === 0 ? (
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
									{paginatedProducts &&
										paginatedProducts?.map((product, i) => (
											<motion.div
												key={i}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: i * 0.05 }}
											>
												<Card className="overflow-hidden group hover:shadow-xl h-full transition-all duration-300 min-h-[400px]">
													<div className="relative">
														<Link
															href={`/products/${product.slug}`}
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

														<div className="flex place-content-end place-self-end">
															<div>
																<motion.span
																	className="text-2xl font-bold text-primary-rose"
																	whileHover={{
																		scale: 1.05,
																	}}
																>
																	{new Intl.NumberFormat(
																		"fa-IR",
																	).format(
																		Number(
																			product.irrPrice,
																		),
																	)}
																</motion.span>
																<span className="text-sm text-muted-foreground mr-2">
																	ریال
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
							{totalPages > 1 && (
								<div className="mt-8">
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={setCurrentPage}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

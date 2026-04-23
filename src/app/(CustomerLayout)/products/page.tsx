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
import InputFree from "@/components/Custom/Input/InputFree";
import SelectFree from "@/components/Custom/Select/SelectFree";

export default function ProductsPage() {
	const { products, fetchProducts } = useProductStore();
	const { categories, fetchCategories } = useCategoryStore();
	const { brands, fetchBrands } = useBrandStore();
	const itemsPerPage = 12;
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("0");
	const [selectedBrand, setSelectedBrand] = useState<string>("0");
	const [currentPage, setCurrentPage] = useState(1);
	const [priceRange, setPriceRange] = useState<number[]>([1000, 100000]);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showFilters, setShowFilters] = useState(false);
	const [sortBy, setSortBy] = useState<string>("newest");

	const filteredProducts = products
		.filter(
			(product: Product) =>
				product.categoryID == selectedCategory ||
				selectedCategory === "0",
		)
		.filter(
			(product: Product) =>
				product.brandID == selectedBrand || selectedBrand === "0",
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
			<Navbar />

			<div className="pt-16 md:pt-20">
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
						{/* Filters Sidebar - STICKY */}
						<motion.aside
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							className={`lg:w-80 ${showFilters ? "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:relative lg:bg-transparent" : "hidden lg:block"}`}
						>
							<div className={`${showFilters ? "fixed top-0 right-0 bottom-0 w-80 bg-background overflow-y-auto" : "sticky top-24"}`}>
								<Card className={showFilters ? "h-full rounded-none" : ""}>
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

										{/* Categories */}
										<div>
											<SelectFree
												value={selectedCategory}
												onValueChange={setSelectedCategory}
												label="دسته‌بندی"
												options={[
													{
														value: "0",
														label: "تمام دسته‌بندی‌ها",
													},
													...categories.map((cat) => ({
														value: String(cat.id),
														label: cat.name,
													})),
												]}
											/>
										</div>

										{/* Brands */}
										<div>
											<SelectFree
												value={selectedBrand}
												onValueChange={(val) => {
													setSelectedBrand(val);
												}}
												label="برند"
												options={[
													{
														value: "0",
														label: "تمام برندها",
													},
													...brands.map((brand) => ({
														value: String(brand.id),
														label: brand.name,
													})),
												]}
											/>
										</div>

										{/* Price Range */}
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">
													محدوده قیمت
												</span>
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
												setSelectedCategory("0");
												setSelectedBrand("0");
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
							</div>
						</motion.aside>

						{/* Products Grid */}
						<div className="flex-1">
							{/* Toolbar */}
							<div className="flex items-center justify-between mb-8 flex-wrap gap-4">
								<div className="flex items-center gap-4 justify-between w-full">
									{/* Mobile Filter Button */}
									<Button
										variant="outline"
										className="lg:hidden gap-2"
										onClick={() => setShowFilters(true)}
									>
										<SlidersHorizontal className="w-5 h-5" />
										فیلترها
									</Button>

									<div className="relative flex-1 lg:flex-initial lg:w-96">
										<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
										<InputFree
											label="نام محصول یا برند..."
											icon={Search}
											value={searchQuery}
											onValueChange={(value) => {
												setSearchQuery(value);
											}}
											inputClassName="pr-10"
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

			<Footer />
		</div>
	);
}
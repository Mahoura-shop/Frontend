"use client";

import { useState, useCallback, useEffect } from "react";
import { formatPrice } from "@/utils/formatPrice";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductGridSkeleton } from "@/components/ui/product-card-skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
	ShoppingBag,
	Star,
	Filter,
	Search,
	SlidersHorizontal,
	X,
	Package,
	ImageIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useBrandStore } from "@/store/useBrandStore";
import { Slider } from "@/components/ui/slider";
import { Pagination } from "@/components/ui/pagination";
import InputFree from "@/components/Custom/Input/InputFree";
import SelectFree from "@/components/Custom/Select/SelectFree";

export default function ProductsPage() {
	const { products, totalCount, fetchProducts } = useProductStore();
	const { categories, fetchCategories } = useCategoryStore();
	const { brands, fetchBrands } = useBrandStore();
	const { addItem } = useCartStore();
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [addingId, setAddingId] = useState<number | null>(null);
	const itemsPerPage = 12;
	const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
	const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("q") ?? "");
	const [selectedCategory, setSelectedCategory] = useState<string>(() => searchParams.get("category") ?? "0");
	const [selectedBrand, setSelectedBrand] = useState<string>(() => searchParams.get("brand") ?? "0");
	const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get("page") ?? "1"));
	const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showFilters, setShowFilters] = useState(false);
	const [sortBy, setSortBy] = useState<string>(() => searchParams.get("sort") ?? "newest");
	const [isLoading, setIsLoading] = useState(false);

	const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
		e.preventDefault();
		setAddingId(productId);
		try {
			await addItem(productId);
		} finally {
			setAddingId(null);
		}
	};

	const totalPages = Math.ceil(totalCount / itemsPerPage);
	const paginatedProducts = products;

	const handlePriceChange = (values: number[]) => {
		setPriceRange(values);
		setCurrentPage(1);
	};

	const mapSortByToBackend = (sort: string): string => {
		switch (sort) {
			case "price-low":
				return "price_asc";
			case "price-high":
				return "price_desc";
			case "newest":
			default:
				return "newest";
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
			setCurrentPage(1);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	useEffect(() => {
		fetchCategories();
		fetchBrands();
	}, []);

	useEffect(() => {
		const params = new URLSearchParams();
		if (debouncedSearch) params.set("q", debouncedSearch);
		if (selectedCategory !== "0") params.set("category", selectedCategory);
		if (selectedBrand !== "0") params.set("brand", selectedBrand);
		if (currentPage > 1) params.set("page", String(currentPage));
		if (sortBy !== "newest") params.set("sort", sortBy);
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}, [debouncedSearch, selectedCategory, selectedBrand, currentPage, sortBy]);

	useEffect(() => {
		const loadProducts = async () => {
			setIsLoading(true);
			try {
				await fetchProducts({
					q: debouncedSearch,
					categoryID: selectedCategory !== "0" ? Number(selectedCategory) : undefined,
					brandID: selectedBrand !== "0" ? Number(selectedBrand) : undefined,
					minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
					maxPrice: priceRange[1] < 100000 ? priceRange[1] : undefined,
					sortBy: mapSortByToBackend(sortBy),
					limit: itemsPerPage,
					offset: (currentPage - 1) * itemsPerPage,
				});
			} finally {
				setIsLoading(false);
			}
		};
		loadProducts();
	}, [debouncedSearch, selectedCategory, selectedBrand, priceRange, sortBy, currentPage]);

	return (
		<div className="min-h-screen bg-background">
			<div>
				{/* Header */}
				<div className="bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20 py-8 md:py-16">
					<div className="container mx-auto px-4 pt-8">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center"
						>
							<h1 className="text-3xl md:text-5xl font-bold gradient-text mb-4">
								تمامی محصولات
							</h1>
							<p className="text-muted-foreground text-lg">
								{products.length} محصول موجود
							</p>
						</motion.div>
					</div>
				</div>

				<div className="container mx-auto px-4 py-6 md:py-12">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Filters Sidebar - STICKY (desktop) / Bottom Sheet (mobile) */}
						{/* Desktop sidebar */}
						<aside className="hidden lg:block lg:w-80">
							<div className="sticky top-24">
								<Card>
									<CardContent className="flex flex-col gap-6 p-6">
										<h3 className="text-xl font-bold flex items-center gap-2">
											<Filter className="w-5 h-5" />
											فیلترها
										</h3>

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
												max={5000000}
												min={0}
												step={10000}
											/>

											<div className="grid grid-cols-2 gap-4">
												<div className="p-3 rounded-lg bg-background border text-center">
													<p className="text-xs text-muted-foreground mb-1">
														حداکثر
													</p>
													<p className="font-bold gradient-text">
														{formatPrice(priceRange[1])}
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
														{formatPrice(priceRange[0])}
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
												setPriceRange([0, 5000000]);
											}}
										>
											پاک کردن فیلترها
										</Button>
									</CardContent>
								</Card>
							</div>
						</aside>

						{/* Mobile filter bottom sheet */}
						<AnimatePresence>
							{showFilters && (
								<motion.div
									key="filter-backdrop"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
									onClick={() => setShowFilters(false)}
								>
									<motion.div
										initial={{ y: "100%" }}
										animate={{ y: 0 }}
										exit={{ y: "100%" }}
										transition={{ type: "spring", damping: 30, stiffness: 300 }}
										className="absolute bottom-0 inset-x-0 glass-panel rounded-t-2xl max-h-[85vh] overflow-y-auto"
										onClick={(e) => e.stopPropagation()}
									>
										{/* Drag handle */}
										<div className="flex justify-center pt-3 pb-1">
											<div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
										</div>
										<div className="flex flex-col gap-6 p-6">
											<div className="flex items-center justify-between">
												<h3 className="text-xl font-bold flex items-center gap-2">
													<Filter className="w-5 h-5" />
													فیلترها
												</h3>
												<Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
													<X className="w-5 h-5" />
												</Button>
											</div>
											<SelectFree
												value={selectedCategory}
												onValueChange={setSelectedCategory}
												label="دسته‌بندی"
												options={[
													{ value: "0", label: "تمام دسته‌بندی‌ها" },
													...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
												]}
											/>
											<SelectFree
												value={selectedBrand}
												onValueChange={setSelectedBrand}
												label="برند"
												options={[
													{ value: "0", label: "تمام برندها" },
													...brands.map((brand) => ({ value: String(brand.id), label: brand.name })),
												]}
											/>
											<div className="space-y-4">
												<span className="text-sm font-medium">محدوده قیمت</span>
												<Slider value={priceRange} onValueChange={handlePriceChange} max={5000000} min={0} step={10000} />
												<div className="grid grid-cols-2 gap-4">
													<div className="p-3 rounded-lg bg-background border text-center">
														<p className="text-xs text-muted-foreground mb-1">حداکثر</p>
														<p className="font-bold gradient-text">{formatPrice(priceRange[1])}</p>
														<p className="font-bold gradient-text">تومان</p>
													</div>
													<div className="p-3 rounded-lg bg-background border text-center">
														<p className="text-xs text-muted-foreground mb-1">حداقل</p>
														<p className="font-bold gradient-text">{formatPrice(priceRange[0])}</p>
														<p className="font-bold gradient-text">تومان</p>
													</div>
												</div>
											</div>
											<Button variant="outline" className="w-full" onClick={() => { setSearchQuery(""); setSelectedCategory("0"); setSelectedBrand("0"); setPriceRange([0, 5000000]); setShowFilters(false); }}>
												پاک کردن فیلترها
											</Button>
										</div>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Products Grid */}
						<div className="flex-1">
							{/* Toolbar */}
							<div className="flex flex-col gap-3 mb-8">
								<div className="flex items-center gap-3">
									<Button
										variant="outline"
										className="lg:hidden gap-2 shrink-0"
										onClick={() => setShowFilters(true)}
									>
										<SlidersHorizontal className="w-5 h-5" />
										فیلترها
									</Button>
									<div className="hidden lg:block flex-1">
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
										<SelectTrigger className="flex-1 lg:flex-none lg:w-48 py-2 border rounded-lg bg-background text-foreground">
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
								<div className="lg:hidden">
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
							</div>

							{/* Products */}
							{isLoading ? (
								<ProductGridSkeleton count={12} />
							) : paginatedProducts &&
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
											? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
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
												<div className="relative rounded-[20px] overflow-hidden cursor-pointer group aspect-[3/4] bg-muted shadow-sm hover:shadow-2xl transition-shadow duration-500">
													{/* Image */}
													<Link href={`/products/${product.slug}`}>
														{product.productPic ? (
															<img
																src={product.productPic}
																alt={product.name}
																className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
															/>
														) : (
															<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-rose/10 to-accent-gold/10">
																<ImageIcon className="w-16 h-16 text-muted-foreground" />
															</div>
														)}
													</Link>

													{/* Badges */}
													<div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
														{product.isNew && (
															<Badge variant="new">
																<Star className="w-3 h-3 ml-1" />
																جدید
															</Badge>
														)}
														{product.quantity === 0 && (
															<Badge variant="outOfStock">ناموجود</Badge>
														)}
													</div>

													{/* Static bottom info — always visible */}
													<div className="absolute bottom-0 inset-x-0 z-10 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
														<p className="text-[11px] font-bold text-white/60 mb-0.5">{product.brand?.name}</p>
														<p className="text-sm font-bold text-white leading-tight line-clamp-1">{product.name}</p>
													</div>

													{/* Hover reveal — slides up over the static info */}
													<motion.div
														initial={{ y: "100%" }}
														whileHover={{ y: 0 }}
														transition={{ duration: 0.35, ease: "easeOut" }}
														className="absolute bottom-0 inset-x-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between gap-3"
													>
														<div className="min-w-0">
															<p className="text-[11px] font-bold text-white/50 mb-0.5">{product.brand?.name}</p>
															<p className="text-sm font-bold text-white leading-tight line-clamp-1 mb-1">{product.name}</p>
															<p className="text-base font-bold text-primary-rose">
																{formatPrice(Number(product.resolvedPrice || product.irrPrice))}
																<span className="text-xs text-white/40 mr-1">ریال</span>
															</p>
														</div>
														<Button
															variant="luxury"
															size="sm"
															className="shrink-0 gap-1.5"
															disabled={addingId === product.id || product.quantity === 0}
															onClick={(e) => handleAddToCart(e, product.id)}
														>
															{addingId === product.id ? (
																<motion.div
																	animate={{ rotate: 360 }}
																	transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
																	className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
																/>
															) : (
																<ShoppingBag className="w-4 h-4" />
															)}
															{product.quantity === 0 ? "ناموجود" : addingId === product.id ? "..." : "افزودن"}
														</Button>
													</motion.div>
												</div>
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
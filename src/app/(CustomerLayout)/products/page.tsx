"use client";

import { useState, useCallback, useEffect } from "react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
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
	RefreshCw,
	Heart,
} from "lucide-react";
import Link from "next/link";
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
import useUserStore from "@/store/userStore/userStore";
import resolvePrice from "@/utils/resolvePrice";
import {
	getWishlist,
	addToWishlist,
	removeFromWishlist,
} from "@/services/wishlistService";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";

export default function ProductsPage() {
	const { products, totalCount, fetchProducts } = useProductStore();
	const { categories, fetchCategories } = useCategoryStore();
	const { brands, fetchBrands } = useBrandStore();
	const { addItem, removeItem, items: cartItems, fetchCart } = useCartStore();
	const { userType, accessToken } = useUserStore();

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [addingId, setAddingId] = useState<number | null>(null);
	const itemsPerPage = 12;
	const [searchQuery, setSearchQuery] = useState(
		() => searchParams.get("q") ?? "",
	);
	const [debouncedSearch, setDebouncedSearch] = useState(
		() => searchParams.get("q") ?? "",
	);
	const [selectedCategory, setSelectedCategory] = useState<string>(
		() => searchParams.get("category") ?? "0",
	);
	const [selectedBrand, setSelectedBrand] = useState<string>(
		() => searchParams.get("brand") ?? "0",
	);
	const [currentPage, setCurrentPage] = useState(() =>
		Number(searchParams.get("page") ?? "1"),
	);
	const [sliderBounds, setSliderBounds] = useState<{
		min: number;
		max: number;
	}>({
		min: 0,
		max: 5000000,
	});
	const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showFilters, setShowFilters] = useState(false);
	const [sortBy, setSortBy] = useState<string>(
		() => searchParams.get("sort") ?? "newest",
	);
	const [isLoading, setIsLoading] = useState(false);
	const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
	const [wishlistingId, setWishlistingId] = useState<number | null>(null);

	const calculatePriceBounds = useCallback(() => {
		if (!products || products.length === 0) {
			setSliderBounds({ min: 0, max: 5000000 });
			return;
		}

		const resolvedPrices = products.map((p) => resolvePrice(p, userType));

		const maxPrice = Math.max(...resolvedPrices);

		setSliderBounds({
			min: 0,
			max: maxPrice,
		});
	}, [products, userType]);

	const refreshProducts = useCallback(async () => {
		setIsLoading(true);
		try {
			await fetchProducts({
				q: debouncedSearch,
				categoryID:
					selectedCategory !== "0"
						? Number(selectedCategory)
						: undefined,
				brandID:
					selectedBrand !== "0" ? Number(selectedBrand) : undefined,
				sortBy: mapSortByToBackend(sortBy),
				limit: itemsPerPage,
				offset: (currentPage - 1) * itemsPerPage,
			});
		} finally {
			setIsLoading(false);
		}
	}, [
		fetchProducts,
		debouncedSearch,
		selectedCategory,
		selectedBrand,
		sortBy,
		currentPage,
	]);

	const { pulling, pullY, refreshing } = usePullToRefresh(refreshProducts);

	const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
		e.preventDefault();
		const product = products.find((p) => p.id === productId);
		if (!product) return;

		const currentCount = getCartCount(productId);
		if (currentCount >= product.quantity) {
			CustomToast("موجودی کافی نیست", "error");
			return;
		}

		setAddingId(productId);
		try {
			await addItem(productId);
		} catch (error: any) {
			CustomToast(
				error?.response?.data?.message || "خطایی رخ داد",
				"error",
			);
		} finally {
			setAddingId(null);
		}
	};

	const handleRemoveFromCart = async (
		e: React.MouseEvent,
		productId: number,
	) => {
		e.preventDefault();
		await removeItem(productId);
	};

	const getCartCount = (productId: number) =>
		cartItems.find((i) => i.product.id === productId)?.count ?? 0;

	const handleToggleWishlist = async (
		e: React.MouseEvent,
		productId: number,
	) => {
		e.preventDefault();
		if (!accessToken) {
			CustomToast("برای افزودن به علاقه‌مندی‌ها وارد شوید", "error");
			return;
		}
		setWishlistingId(productId);
		try {
			if (wishlistIds.has(productId)) {
				await removeFromWishlist(productId);
				setWishlistIds((prev) => {
					const next = new Set(prev);
					next.delete(productId);
					return next;
				});
				CustomToast("از علاقه‌مندی‌ها حذف شد", "success");
			} else {
				await addToWishlist(productId);
				setWishlistIds((prev) => new Set([...prev, productId]));
				CustomToast("به علاقه‌مندی‌ها اضافه شد", "success");
			}
		} catch {
		} finally {
			setWishlistingId(null);
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
			case "popularity":
				return "popularity";
			case "most-visited":
				return "most_visited";
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
		if (accessToken) fetchCart();
	}, []);

	useEffect(() => {
		calculatePriceBounds();
	}, [calculatePriceBounds]);

	useEffect(() => {
		setPriceRange([0, sliderBounds.max]);
	}, [sliderBounds.max]);

	useEffect(() => {
		if (!accessToken) return;
		getWishlist()
			.then((res) => {
				const ids: number[] = (res?.data ?? []).map(
					(item: any) => item.product.id,
				);
				setWishlistIds(new Set(ids));
			})
			.catch(() => {});
	}, [accessToken]);

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
					categoryID:
						selectedCategory !== "0"
							? Number(selectedCategory)
							: undefined,
					brandID:
						selectedBrand !== "0"
							? Number(selectedBrand)
							: undefined,
					minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
					maxPrice:
						priceRange[1] < 100000 ? priceRange[1] : undefined,
					sortBy: mapSortByToBackend(sortBy),
					limit: itemsPerPage,
					offset: (currentPage - 1) * itemsPerPage,
				});
			} finally {
				setIsLoading(false);
			}
		};
		loadProducts();
	}, [
		debouncedSearch,
		selectedCategory,
		selectedBrand,
		priceRange,
		sortBy,
		currentPage,
	]);

	return (
		<div className="min-h-screen bg-background">
			{/* Pull-to-refresh indicator */}
			{(pulling || refreshing) && (
				<div
					className="fixed top-0 inset-x-0 z-50 flex items-center justify-center pointer-events-none"
					style={{
						height: pullY || (refreshing ? 56 : 0),
						transition: pulling ? "none" : "height 0.3s ease",
					}}
				>
					<div className="flex items-center gap-2 bg-background/90 backdrop-blur border border-border rounded-full px-4 py-2 shadow-lg text-sm text-muted-foreground">
						<RefreshCw
							className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
							style={
								!refreshing
									? {
											transform: `rotate(${(pullY / 56) * 180}deg)`,
										}
									: undefined
							}
						/>
						{refreshing ? "در حال بارگذاری..." : "رها کنید"}
					</div>
				</div>
			)}
			<div>
				{/* Header */}
				<div className="bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20 py-8 md:py-32 md:pb-16">
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
								{new Intl.NumberFormat("fa-IR").format(
									products.length,
								)}{" "}
								محصول موجود
							</p>
						</motion.div>
					</div>
				</div>

				<div className="container mx-auto px-4 py-6 md:py-12">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Filters Sidebar - STICKY (desktop) / Bottom Sheet (mobile) */}
						{/* Desktop sidebar */}
						<aside className="hidden lg:block lg:w-80 self-start sticky top-28">
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
											max={sliderBounds.max}
											min={sliderBounds.min}
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
													ریال
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
													ریال
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
												sliderBounds.min,
												sliderBounds.max,
											]);
										}}
									>
										پاک کردن فیلترها
									</Button>
								</CardContent>
							</Card>
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
										transition={{
											type: "spring",
											damping: 30,
											stiffness: 300,
										}}
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
												<Button
													variant="ghost"
													size="icon"
													onClick={() =>
														setShowFilters(false)
													}
												>
													<X className="w-5 h-5" />
												</Button>
											</div>
											<SelectFree
												value={selectedCategory}
												onValueChange={
													setSelectedCategory
												}
												label="دسته‌بندی"
												options={[
													{
														value: "0",
														label: "تمام دسته‌بندی‌ها",
													},
													...categories.map(
														(cat) => ({
															value: String(
																cat.id,
															),
															label: cat.name,
														}),
													),
												]}
											/>
											<SelectFree
												value={selectedBrand}
												onValueChange={setSelectedBrand}
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
											<div className="space-y-4">
												<span className="text-sm font-medium">
													محدوده قیمت
												</span>
												<Slider
													value={priceRange}
													onValueChange={
														handlePriceChange
													}
													max={sliderBounds.max}
													min={sliderBounds.min}
													step={10000}
												/>
												<div className="grid grid-cols-2 gap-4">
													<div className="p-3 rounded-lg bg-background border text-center">
														<p className="text-xs text-muted-foreground mb-1">
															حداکثر
														</p>
														<p className="font-bold gradient-text">
															{formatPrice(
																priceRange[1],
															)}
														</p>
														<p className="font-bold gradient-text">
															ریال
														</p>
													</div>
													<div className="p-3 rounded-lg bg-background border text-center">
														<p className="text-xs text-muted-foreground mb-1">
															حداقل
														</p>
														<p className="font-bold gradient-text">
															{formatPrice(
																priceRange[0],
															)}
														</p>
														<p className="font-bold gradient-text">
															ریال
														</p>
													</div>
												</div>
											</div>
											<Button
												variant="outline"
												className="w-full"
												onClick={() => {
													setSearchQuery("");
													setSelectedCategory("0");
													setSelectedBrand("0");
													setPriceRange([
														sliderBounds.min,
														sliderBounds.max,
													]);
													setShowFilters(false);
												}}
											>
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
												<SelectItem value="popularity">
													پرطرفدارترین
												</SelectItem>
												<SelectItem value="price-low">
													ارزان‌ترین
												</SelectItem>
												<SelectItem value="price-high">
													گران‌ترین
												</SelectItem>
											</SelectGroup>
											<SelectItem value="most-visited">
												پربازدیدترین
											</SelectItem>
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
												whileHover={{ y: -6 }}
												className="isolate rounded-[20px] overflow-hidden bg-card border border-border cursor-pointer group shadow-[0_2px_6px_rgba(107,78,113,0.10),0_6px_20px_rgba(107,78,113,0.06)] hover:shadow-[0_4px_12px_rgba(107,78,113,0.18),0_20px_48px_rgba(201,168,117,0.14)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),0_6px_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_4px_12px_rgba(107,78,113,0.35),0_20px_48px_rgba(201,168,117,0.18)] transition-shadow duration-500"
											>
												{/* Image */}
												<div className="relative aspect-square overflow-hidden bg-muted">
													<Link
														href={`/products/${product.slug}`}
													>
														{product.productPic ? (
															<img
																src={
																	product.productPic
																}
																alt={
																	product.name
																}
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
																<Star className="w-3 h-3 me-1" />
																جدید
															</Badge>
														)}
														{product.quantity ===
															0 && (
															<Badge variant="outOfStock">
																ناموجود
															</Badge>
														)}
													</div>

													{/* Wishlist button */}
													<div
														className="absolute top-3 left-3 z-20"
														onClick={(e) => e.preventDefault()}
													>
														{accessToken && (
															<button
																className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border hover:scale-110 transition-transform disabled:opacity-50"
																onClick={(e) => handleToggleWishlist(e, product.id)}
																disabled={wishlistingId === product.id}
															>
																<Heart
																	className={`w-4 h-4 transition-colors ${wishlistIds.has(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
																/>
															</button>
														)}
													</div>
												</div>

												{/* Info footer — always visible */}
												<div className="p-4">
													<Link href={`/products/${product.slug}`}>
														<div className="flex items-center gap-2 mb-1">
															{product.brand?.name && (
																<p className="text-xs text-muted-foreground font-semibold truncate">{product.brand.name}</p>
															)}
															{product.category?.name && (
																<Badge variant="outline" className="text-[10px] px-2 py-0.5 shrink-0 bg-secondary-plum/10 border-secondary-plum/30 text-secondary-plum font-semibold tracking-wide rounded-full">{product.category.name}</Badge>
															)}
														</div>
														<p className="text-sm font-bold text-foreground leading-snug line-clamp-2 mb-3">{product.name}</p>
													</Link>
													<div className="flex items-center justify-between gap-2">
														<Link href={`/products/${product.slug}`} className="flex-1 min-w-0">
															<p className="text-base font-bold text-primary-rose">
																{formatPrice(resolvePrice(product, userType))}
																<span className="text-xs text-muted-foreground ms-1">ریال</span>
															</p>
															{!!product.consumerPrice && product.consumerPrice !== resolvePrice(product, userType) && (
																<p className="text-xs text-muted-foreground line-through">
																	{formatPrice(product.consumerPrice)} ریال
																</p>
															)}
														</Link>
														{accessToken && (
															<div className="shrink-0" onClick={(e) => e.preventDefault()}>
																{getCartCount(product.id) > 0 ? (
																	<div className="flex items-center bg-muted rounded-full border border-border overflow-hidden">
																		<button
																			className="w-7 h-8 flex items-center justify-center text-muted-foreground hover:text-primary-rose transition-colors text-sm font-bold"
																			onClick={(e) => handleRemoveFromCart(e, product.id)}
																		>-</button>
																		<span className="text-xs font-bold px-1 min-w-[1.25rem] text-center">{getCartCount(product.id)}</span>
																		<button
																			className="w-7 h-8 flex items-center justify-center text-muted-foreground hover:text-primary-rose transition-colors text-sm font-bold disabled:opacity-50"
																			disabled={addingId === product.id || product.quantity === 0 || getCartCount(product.id) >= product.quantity}
																			onClick={(e) => handleAddToCart(e, product.id)}
																		>+</button>
																	</div>
																) : (
																	<button
																		className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-primary-rose/10 hover:bg-primary-rose/20 border border-primary-rose/30 text-primary-rose text-xs font-semibold transition-colors disabled:opacity-50"
																		disabled={addingId === product.id || product.quantity === 0}
																		onClick={(e) => handleAddToCart(e, product.id)}
																	>
																		{addingId === product.id ? (
																			<div className="w-3.5 h-3.5 border-2 border-primary-rose border-t-transparent rounded-full animate-spin" />
																		) : (
																			<ShoppingBag className="w-3.5 h-3.5" />
																		)}
																		افزودن
																	</button>
																)}
															</div>
														)}
													</div>
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

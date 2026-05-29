"use client";

import { useState, useCallback, useEffect } from "react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { motion } from "framer-motion";
import { Package, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductGridSkeleton } from "@/components/ui/product-card-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useBrandStore } from "@/store/useBrandStore";
import useUserStore from "@/store/useUserStore";
import {
	getWishlist,
	addToWishlist,
	removeFromWishlist,
} from "@/services/wishlistService";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import ProductCard from "@/components/products/ProductCard";
import ProductFilterSidebar from "@/components/products/ProductFilterSidebar";
import MobileFilterSheet from "@/components/products/MobileFilterSheet";
import ProductsToolbar from "@/components/products/ProductsToolbar";
import resolvePrice from "@/utils/resolvePrice";
import BackgroundPortraits from "@/components/BackgroundPortraits/BackgroundPortraits";

const ITEMS_PER_PAGE = 12;

function mapSort(sort: string): string {
	switch (sort) {
		case "price-low":
			return "price_asc";
		case "price-high":
			return "price_desc";
		case "popularity":
			return "popularity";
		case "most-visited":
			return "most_visited";
		default:
			return "newest";
	}
}

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
	const [searchQuery, setSearchQuery] = useState(
		() => searchParams.get("q") ?? "",
	);
	const [debouncedSearch, setDebouncedSearch] = useState(
		() => searchParams.get("q") ?? "",
	);
	const [selectedCategory, setSelectedCategory] = useState(
		() => searchParams.get("category") ?? "0",
	);
	const [selectedBrand, setSelectedBrand] = useState(
		() => searchParams.get("brand") ?? "0",
	);
	const [currentPage, setCurrentPage] = useState(() =>
		Number(searchParams.get("page") ?? "1"),
	);
	const [sliderBounds, setSliderBounds] = useState({ min: 0, max: 5000000 });
	const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
	const [showFilters, setShowFilters] = useState(false);
	const [sortBy, setSortBy] = useState(
		() => searchParams.get("sort") ?? "newest",
	);
	const [isLoading, setIsLoading] = useState(false);
	const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
	const [wishlistingId, setWishlistingId] = useState<number | null>(null);

	const getCartCount = (productId: number) =>
		cartItems.find((i) => i.product.id === productId)?.count ?? 0;

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
				sortBy: mapSort(sortBy),
				limit: ITEMS_PER_PAGE,
				offset: (currentPage - 1) * ITEMS_PER_PAGE,
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
		if (getCartCount(productId) >= product.quantity) {
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

	const handleClearFilters = () => {
		setSearchQuery("");
		setSelectedCategory("0");
		setSelectedBrand("0");
		setPriceRange([sliderBounds.min, sliderBounds.max]);
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
		if (!products || products.length === 0) {
			setSliderBounds({ min: 0, max: 5000000 });
			return;
		}
		const max = Math.max(...products.map((p) => resolvePrice(p, userType)));
		setSliderBounds({ min: 0, max });
	}, [products, userType]);

	useEffect(() => {
		setPriceRange([0, sliderBounds.max]);
	}, [sliderBounds.max]);

	useEffect(() => {
		if (!accessToken) return;
		getWishlist()
			.then((res) =>
				setWishlistIds(
					new Set(
						(res?.data ?? []).map((item: any) => item.product.id),
					),
				),
			)
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
		const load = async () => {
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
					sortBy: mapSort(sortBy),
					limit: ITEMS_PER_PAGE,
					offset: (currentPage - 1) * ITEMS_PER_PAGE,
				});
			} finally {
				setIsLoading(false);
			}
		};
		load();
	}, [
		debouncedSearch,
		selectedCategory,
		selectedBrand,
		priceRange,
		sortBy,
		currentPage,
	]);

	const filterProps = {
		selectedCategory,
		selectedBrand,
		priceRange,
		sliderBounds,
		categories,
		brands,
		onCategoryChange: setSelectedCategory,
		onBrandChange: setSelectedBrand,
		onPriceChange: (v: number[]) => {
			setPriceRange(v);
			setCurrentPage(1);
		},
		onClear: handleClearFilters,
	};
	const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

	return (
		<div className="min-h-screen bg-background">
			<BackgroundPortraits mode="absolute" count={20} seed={15} />
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
					<ProductFilterSidebar {...filterProps} />
					<MobileFilterSheet
						{...filterProps}
						open={showFilters}
						onClose={() => setShowFilters(false)}
					/>

					<div className="flex-1">
						<ProductsToolbar
							searchQuery={searchQuery}
							sortBy={sortBy}
							onSearchChange={setSearchQuery}
							onSortChange={setSortBy}
							onShowFilters={() => setShowFilters(true)}
						/>

						{isLoading ? (
							<ProductGridSkeleton count={12} />
						) : products.length === 0 ? (
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
							<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
								{products.map((product, i) => (
									<ProductCard
										key={product.id}
										product={product}
										index={i}
										cartCount={getCartCount(product.id)}
										addingId={addingId}
										wishlistIds={wishlistIds}
										wishlistingId={wishlistingId}
										accessToken={accessToken}
										userType={userType}
										onAddToCart={handleAddToCart}
										onRemoveFromCart={handleRemoveFromCart}
										onToggleWishlist={handleToggleWishlist}
									/>
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
	);
}

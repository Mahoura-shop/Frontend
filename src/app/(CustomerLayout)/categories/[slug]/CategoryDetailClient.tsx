"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Package } from "lucide-react";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import useUserStore from "@/store/useUserStore";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import { ProductGridSkeleton } from "@/components/ui/product-card-skeleton";
import { Pagination } from "@/components/ui/pagination";
import ProductCard from "@/components/products/ProductCard";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";

const ITEMS_PER_PAGE = 12;

export default function CategoryDetailClient() {
	const { slug } = useParams<{ slug: string }>();
	const { categories, fetchCategories } = useCategoryStore();
	const { products, totalCount, fetchProducts } = useProductStore();
	const { addItem, removeItem, items: cartItems, fetchCart } = useCartStore();
	const { userType, accessToken } = useUserStore();

	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [addingId, setAddingId] = useState<number | null>(null);
	const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
	const [wishlistingId, setWishlistingId] = useState<number | null>(null);

	useEffect(() => {
		if (categories.length === 0) fetchCategories();
	}, []);

	const category = categories.find((c) => c.slug === slug);

	const loadProducts = useCallback(async (categoryId: number, page: number) => {
		setIsLoading(true);
		try {
			await fetchProducts({ categoryID: categoryId, limit: ITEMS_PER_PAGE, offset: (page - 1) * ITEMS_PER_PAGE });
		} finally {
			setIsLoading(false);
		}
	}, [fetchProducts]);

	useEffect(() => {
		if (!category) return;
		loadProducts(category.id, currentPage);
	}, [category?.id, currentPage]);

	useEffect(() => {
		if (accessToken) fetchCart();
	}, [accessToken]);

	useEffect(() => {
		if (!accessToken) return;
		getWishlist()
			.then((res) => setWishlistIds(new Set((res?.data ?? []).map((item: any) => item.product.id))))
			.catch(() => {});
	}, [accessToken]);

	const getCartCount = (productId: number) =>
		cartItems.find((i) => i.product.id === productId)?.count ?? 0;

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
			CustomToast(error?.response?.data?.message || "خطایی رخ داد", "error");
		} finally {
			setAddingId(null);
		}
	};

	const handleRemoveFromCart = async (e: React.MouseEvent, productId: number) => {
		e.preventDefault();
		await removeItem(productId);
	};

	const handleToggleWishlist = async (e: React.MouseEvent, productId: number) => {
		e.preventDefault();
		if (!accessToken) {
			CustomToast("برای افزودن به علاقه‌مندی‌ها وارد شوید", "error");
			return;
		}
		setWishlistingId(productId);
		try {
			if (wishlistIds.has(productId)) {
				await removeFromWishlist(productId);
				setWishlistIds((prev) => { const next = new Set(prev); next.delete(productId); return next; });
				CustomToast("از علاقه‌مندی‌ها حذف شد", "success");
			} else {
				await addToWishlist(productId);
				setWishlistIds((prev) => new Set([...prev, productId]));
				CustomToast("به علاقه‌مندی‌ها اضافه شد", "success");
			}
		} catch {} finally {
			setWishlistingId(null);
		}
	};

	if (categories.length > 0 && !category) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-muted-foreground">دسته‌بندی‌ای با این مشخصات یافت نشد</p>
			</div>
		);
	}

	if (!category) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-10 h-10 border-4 border-primary-rose border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

	return (
		<div className="min-h-screen bg-background">
			{/* Hero */}
			<div className="bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20 py-24">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col items-center gap-6 text-center mx-auto"
					>
						<div className="w-32 h-32 rounded-full bg-background shadow-lg flex items-center justify-center overflow-hidden border-4 border-white/30">
							{category.categoryPic ? (
								<Image
									src={category.categoryPic}
									alt={category.name}
									width={128}
									height={128}
									className="object-cover w-full h-full"
								/>
							) : (
								<span className="text-5xl font-bold text-muted-foreground">
									{category.name.charAt(0)}
								</span>
							)}
						</div>

						<div>
							<h1 className="text-4xl md:text-5xl font-bold gradient-text pb-3">{category.name}</h1>
							{category.description && (
								<p className="text-lg text-muted-foreground leading-relaxed text-justify">{category.description}</p>
							)}
						</div>

						<div className="flex items-center gap-2 text-muted-foreground">
							<Package className="w-5 h-5" />
							<span>{category.count} محصول در این دسته‌بندی</span>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Products */}
			<div className="container mx-auto px-4 py-12">
				{isLoading ? (
					<ProductGridSkeleton count={ITEMS_PER_PAGE} />
				) : products.length === 0 ? (
					<div className="text-center py-20">
						<Package className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-2xl font-bold mb-2">محصولی یافت نشد</h3>
						<p className="text-muted-foreground">این دسته‌بندی در حال حاضر محصولی ندارد</p>
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
						<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
					</div>
				)}
			</div>
		</div>
	);
}

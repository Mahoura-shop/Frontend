"use client";

import { useState, useEffect, useRef } from "react";
import { Package } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/store/useProductStore";
import { getData, postData } from "@/services/services";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCartStore } from "@/store/useCartStore";
import useUserStore from "@/store/useUserStore";
import { getProductReviews, submitReview } from "@/services/reviewService";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import ProductImages from "@/components/products/ProductImages";
import ProductInfo from "@/components/products/ProductInfo";
import ProductReviews from "@/components/products/ProductReviews";

interface Review {
	id: number;
	userFirstName: string;
	userLastName: string;
	rating: number;
	comment: string;
	isVerified: boolean;
	createdAt: string;
}

export default function ProductDetailClient() {
	const params = useParams();
	const router = useRouter();
	const [product, setProduct] = useState<Product | null>(null);
	const [selectedImage, setSelectedImage] = useState(0);
	const [adding, setAdding] = useState(false);
	const addToCartRef = useRef<HTMLDivElement>(null);
	const { formatPrice } = useSettingsStore();
	const { addItem, removeItem, items: cartItems, fetchCart } = useCartStore();
	const { userType, accessToken } = useUserStore();

	const [reviews, setReviews] = useState<Review[]>([]);
	const [reviewRating, setReviewRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [reviewComment, setReviewComment] = useState("");
	const [submittingReview, setSubmittingReview] = useState(false);
	const [alreadyReviewed, setAlreadyReviewed] = useState(false);
	const [wishlisted, setWishlisted] = useState(false);
	const [wishlistLoading, setWishlistLoading] = useState(false);

	const cartCount = cartItems.find((i) => i.product.id === product?.id)?.count ?? 0;

	const fetchReviews = (productID: number) => {
		getProductReviews(productID).then((data) => setReviews(data?.data ?? [])).catch(() => {});
	};

	useEffect(() => {
		getData({ endPoint: `/v1/products/slug/${params.slug}` })
			.then((data) => {
				const p = data?.data;
				setProduct(p);
				if (p?.id) {
					fetchReviews(p.id);
					postData({ endPoint: `/v1/products/${p.id}/visit` }).catch(() => {});
				}
			});
		if (accessToken) fetchCart();
	}, []);

	useEffect(() => {
		if (!product?.id || !accessToken) return;
		getWishlist()
			.then((res) => setWishlisted((res?.data ?? []).map((item: any) => item.product.id).includes(product.id)))
			.catch(() => {});
	}, [product?.id, accessToken]);

	const handleAddToCart = async () => {
		if (!product) return;
		if (cartCount >= product.quantity) { CustomToast("موجودی کافی نیست", "error"); return; }
		setAdding(true);
		addItem(product.id)
			.catch((error: any) => CustomToast(error?.response?.data?.message || "خطایی رخ داد", "error"))
			.finally(() => setAdding(false));
	};

	const handleRemoveFromCart = async () => {
		if (!product) return;
		await removeItem(product.id);
	};

	const handleToggleWishlist = async () => {
		if (!product) return;
		if (!accessToken) { CustomToast("برای افزودن به علاقه‌مندی‌ها وارد شوید", "error"); return; }
		setWishlistLoading(true);
		try {
			if (wishlisted) { await removeFromWishlist(product.id); setWishlisted(false); CustomToast("از علاقه‌مندی‌ها حذف شد", "success"); }
			else { await addToWishlist(product.id); setWishlisted(true); CustomToast("به علاقه‌مندی‌ها اضافه شد", "success"); }
		} catch {} finally { setWishlistLoading(false); }
	};

	const handleSubmitReview = async () => {
		if (!product || reviewRating === 0) { CustomToast("لطفاً امتیاز را انتخاب کنید", "error"); return; }
		setSubmittingReview(true);
		try {
			await submitReview(product.id, reviewRating, reviewComment);
			CustomToast("نظر شما با موفقیت ثبت شد", "success");
			setAlreadyReviewed(true); setReviewRating(0); setReviewComment("");
			fetchReviews(product.id);
		} catch {} finally { setSubmittingReview(false); }
	};

	if (!product) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Package className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
					<h2 className="text-2xl font-bold mb-2">محصول یافت نشد</h2>
					<Button onClick={() => router.push("/products")}>بازگشت به محصولات</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background lg:pt-20">
			<div className="bg-background border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Link href="/" className="hover:text-foreground">خانه</Link>
						<ChevronLeft className="w-4 h-4" />
						<Link href="/products" className="hover:text-foreground">محصولات</Link>
						<ChevronLeft className="w-4 h-4" />
						<span className="text-foreground">{product.name}</span>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				<div className="grid lg:grid-cols-2 gap-6 lg:gap-12 mb-16">
					<ProductImages product={product} selectedImage={selectedImage} onSelectImage={setSelectedImage} />
					<ProductInfo
						product={product}
						userType={userType}
						accessToken={accessToken}
						cartCount={cartCount}
						adding={adding}
						wishlisted={wishlisted}
						wishlistLoading={wishlistLoading}
						addToCartRef={addToCartRef}
						formatPrice={formatPrice}
						onAddToCart={handleAddToCart}
						onRemoveFromCart={handleRemoveFromCart}
						onToggleWishlist={handleToggleWishlist}
					/>
				</div>

				<ProductReviews
					reviews={reviews}
					accessToken={accessToken}
					alreadyReviewed={alreadyReviewed}
					reviewRating={reviewRating}
					hoverRating={hoverRating}
					reviewComment={reviewComment}
					submittingReview={submittingReview}
					onRatingChange={setReviewRating}
					onHoverRating={setHoverRating}
					onHoverLeave={() => setHoverRating(0)}
					onCommentChange={setReviewComment}
					onSubmit={handleSubmitReview}
				/>
			</div>
		</div>
	);
}

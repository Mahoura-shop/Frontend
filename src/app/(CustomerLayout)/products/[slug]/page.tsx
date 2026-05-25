"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spring } from "@/lib/motion";
import {
	ShoppingBag,
	Star,
	Check,
	Share2,
	ChevronLeft,
	Package,
	ImageIcon,
	Copy,
	Send,
	BadgeCheck,
	MessageSquare,
	Heart,
	Minus,
	Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/useProductStore";
import { getData, postData } from "@/services/services";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCartStore } from "@/store/useCartStore";
import useUserStore from "@/store/userStore/userStore";
import resolvePrice from "@/utils/resolvePrice";
import { getProductReviews, submitReview } from "@/services/reviewService";
import {
	getWishlist,
	addToWishlist,
	removeFromWishlist,
} from "@/services/wishlistService";

interface Review {
	id: number;
	userID: number;
	userPhone: string;
	userFirstName: string;
	userLastName: string;
	productID: number;
	rating: number;
	comment: string;
	isVerified: boolean;
	createdAt: string;
}

export default function ProductDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [selectedImage, setSelectedImage] = useState(0);
	const [adding, setAdding] = useState(false);
	const [added, setAdded] = useState(false);
	const [showStickyBar, setShowStickyBar] = useState(false);
	const addToCartRef = useRef<HTMLDivElement>(null);
	const { formatPrice } = useSettingsStore();
	const { addItem, removeItem, items: cartItems, fetchCart } = useCartStore();
	const { products } = useProductStore();
	const { userType, accessToken } = useUserStore();

	const [reviews, setReviews] = useState<Review[]>([]);
	const [reviewRating, setReviewRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [reviewComment, setReviewComment] = useState("");
	const [submittingReview, setSubmittingReview] = useState(false);
	const [alreadyReviewed, setAlreadyReviewed] = useState(false);
	const [wishlisted, setWishlisted] = useState(false);
	const [wishlistLoading, setWishlistLoading] = useState(false);

	const trackVisit = (productID: number) => {
		postData({ endPoint: `/v1/products/${productID}/visit` }).catch(
			() => {},
		);
	};

	const getProduct = () => {
		setLoading(true);
		getData({ endPoint: `/v1/products/slug/${params.slug}` })
			.then((data) => {
				const p = data?.data;
				setProduct(p);
				if (p?.id) {
					fetchReviews(p.id);
					trackVisit(p.id);
				}
			})
			.finally(() => setLoading(false));
	};

	const fetchReviews = (productID: number) => {
		getProductReviews(productID)
			.then((data) => setReviews(data?.data ?? []))
			.catch(() => {});
	};

	const handleSubmitReview = async () => {
		if (!product || reviewRating === 0) {
			CustomToast("لطفاً امتیاز را انتخاب کنید", "error");
			return;
		}
		setSubmittingReview(true);
		try {
			await submitReview(product.id, reviewRating, reviewComment);
			CustomToast("نظر شما با موفقیت ثبت شد", "success");
			setAlreadyReviewed(true);
			setReviewRating(0);
			setReviewComment("");
			fetchReviews(product.id);
		} catch {
		} finally {
			setSubmittingReview(false);
		}
	};

	const handleAddToCart = async () => {
		if (!product) return;

		if (cartCount >= product.quantity) {
			CustomToast("موجودی کافی نیست", "error");
			return;
		}

		setAdding(true);
		try {
			await addItem(product.id);
			setAdded(true);
			setTimeout(() => setAdded(false), 2000);
		} catch (error: any) {
			CustomToast(
				error?.response?.data?.message || "خطایی رخ داد",
				"error",
			);
		} finally {
			setAdding(false);
		}
	};

	const handleRemoveFromCart = async () => {
		if (!product) return;
		await removeItem(product.id);
	};

	const cartCount =
		cartItems.find((i) => i.product.id === product?.id)?.count ?? 0;

	useEffect(() => {
		if (!product?.id || !accessToken) return;
		getWishlist()
			.then((res) => {
				const ids: number[] = (res?.data ?? []).map(
					(item: any) => item.product.id,
				);
				setWishlisted(ids.includes(product.id));
			})
			.catch(() => {});
	}, [product?.id, accessToken]);

	const handleToggleWishlist = async () => {
		if (!product) return;
		if (!accessToken) {
			CustomToast("برای افزودن به علاقه‌مندی‌ها وارد شوید", "error");
			return;
		}
		setWishlistLoading(true);
		try {
			if (wishlisted) {
				await removeFromWishlist(product.id);
				setWishlisted(false);
				CustomToast("از علاقه‌مندی‌ها حذف شد", "success");
			} else {
				await addToWishlist(product.id);
				setWishlisted(true);
				CustomToast("به علاقه‌مندی‌ها اضافه شد", "success");
			}
		} catch {
		} finally {
			setWishlistLoading(false);
		}
	};

	useEffect(() => {
		getProduct();
		if (accessToken) fetchCart();
	}, []);

	useEffect(() => {
		const el = addToCartRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => setShowStickyBar(!entry.isIntersecting),
			{ threshold: 0 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [product]);

	if (!product) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Package className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
					<h2 className="text-2xl font-bold mb-2">محصول یافت نشد</h2>
					<Button onClick={() => router.push("/products")}>
						بازگشت به محصولات
					</Button>
				</div>
			</div>
		);
	}

	const relatedProducts = products
		.filter((p) => p.category === product.category && p.id !== product.id)
		.slice(0, 4);

	return (
		<>
			<div className="min-h-screen bg-background pt-20">
				{/* Breadcrumb */}
				<div className="bg-background border-b">
					<div className="container mx-auto px-4 py-4">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Link href="/" className="hover:text-foreground">
								خانه
							</Link>
							<ChevronLeft className="w-4 h-4" />
							<Link
								href="/products"
								className="hover:text-foreground"
							>
								محصولات
							</Link>
							<ChevronLeft className="w-4 h-4" />
							<span className="text-foreground">
								{product.name}
							</span>
						</div>
					</div>
				</div>

				<div className="container mx-auto px-4 py-12">
					<div className="grid lg:grid-cols-2 gap-6 lg:gap-12 mb-16">
						{/* Product Images */}
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
						>
							{/* Main Image */}
							<div className="relative mb-4 rounded-2xl overflow-hidden shadow-2xl group h-64 sm:h-80 lg:min-h-[70vh]">
								<AnimatePresence mode="wait">
									{(() => {
										const allImages = product.images?.length
											? product.images
											: product.productPic
												? [product.productPic]
												: [];
										const src =
											allImages[selectedImage] ??
											allImages[0];
										return src ? (
											<motion.div
												key={src}
												className="absolute inset-0"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.3 }}
											>
												<Image
													src={src}
													alt={product.name}
													fill
													priority
													sizes="(max-width: 1024px) 100vw, 50vw"
													className="object-cover"
												/>
											</motion.div>
										) : (
											<div className="absolute inset-0 flex items-center justify-center">
												<ImageIcon className="w-16 h-16 text-muted-foreground" />
											</div>
										);
									})()}
								</AnimatePresence>

								{product.isNew && (
									<Badge
										variant="new"
										className="absolute top-4 right-4 z-10"
									>
										<Star className="w-3 h-3 me-1" />
										جدید
									</Badge>
								)}

								{product.quantity == 0 && (
									<div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
										<div className="text-center text-white">
											<h3 className="text-3xl font-bold mb-2">
												ناموجود
											</h3>
											<Button variant="secondary">
												اطلاع از موجود شدن
											</Button>
										</div>
									</div>
								)}
							</div>

							{/* Thumbnail strip */}
							{(() => {
								const allImages = product.images?.length
									? product.images
									: product.productPic
										? [product.productPic]
										: [];
								if (allImages.length <= 1) return null;
								return (
									<div className="grid grid-cols-4 gap-3 mt-4">
										{allImages.map((img, i) => (
											<motion.button
												key={i}
												onClick={() =>
													setSelectedImage(i)
												}
												className={`relative rounded-lg overflow-hidden border-2 transition-colors h-20 ${
													selectedImage === i
														? "border-primary-rose shadow-md"
														: "border-transparent hover:border-muted-foreground/40"
												}`}
												whileHover={{ scale: 1.04 }}
												whileTap={{ scale: 0.96 }}
											>
												<Image
													src={img}
													alt={`${product.name} ${i + 1}`}
													fill
													sizes="25vw"
													className="object-cover"
												/>
											</motion.button>
										))}
									</div>
								);
							})()}
						</motion.div>

						{/* Product Info */}
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							className="space-y-6"
						>
							<div className="flex justify-between pb-4 border-b">
								<div className="flex flex-col gap-2">
									<p className="text-muted-foreground mb-2">
										{product?.brand?.name}
									</p>
									<h1 className="text-4xl font-bold mb-2">
										{product.name}
									</h1>
									{product.slug && (
										<p className="text-lg text-muted-foreground">
											{product?.category?.name}
										</p>
									)}
									{(product.reviewCount ?? 0) > 0 && (
										<div className="flex items-center gap-2 mt-2">
											<div className="flex gap-0.5">
												{[1, 2, 3, 4, 5].map((s) => (
													<Star
														key={s}
														className={`w-4 h-4 ${
															s <=
															Math.round(
																product.averageRating ??
																	0,
															)
																? "fill-amber-400 text-amber-400"
																: "text-muted-foreground/30"
														}`}
													/>
												))}
											</div>
											<span className="text-sm font-medium text-amber-500">
												{(
													product.averageRating ?? 0
												).toFixed(1)}
											</span>
											<span className="text-xs text-muted-foreground">
												({product.reviewCount} نظر)
											</span>
										</div>
									)}
								</div>
								<div className="flex gap-2">
									{accessToken && (
										<Button
											variant="outline"
											size="icon"
											className="w-12 h-12"
											onClick={handleToggleWishlist}
											disabled={wishlistLoading}
										>
											<Heart
												className={`w-5 h-5 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : ""}`}
											/>
										</Button>
									)}
									<Button
										variant="outline"
										size="icon"
										className="w-12 h-12"
										onClick={() => {
											navigator.clipboard.writeText(
												window.location.href,
											);
											CustomToast(
												"لینک کپی شد",
												"success",
											);
										}}
									>
										<Copy className="w-5 h-5" />
									</Button>
									{typeof navigator !== "undefined" &&
										"share" in navigator && (
											<Button
												variant="outline"
												size="icon"
												className="w-12 h-12"
												onClick={async () => {
													try {
														await navigator.share({
															title: product.name,
															text: `${product.name} را در ماهورا ببینید:`,
															url: window.location
																.href,
														});
													} catch (e: any) {
														if (
															e?.name !==
															"AbortError"
														) {
															navigator.clipboard.writeText(
																window.location
																	.href,
															);
															CustomToast(
																"لینک کپی شد",
																"success",
															);
														}
													}
												}}
											>
												<Share2 className="w-5 h-5" />
											</Button>
										)}
								</div>
							</div>

							{/* Price */}
							<div className="py-6 border-b space-y-4">
								<div className="flex items-baseline gap-3">
									<motion.span
										className="text-5xl font-bold text-primary-rose"
										initial={{ scale: 0.8 }}
										animate={{ scale: 1 }}
										transition={{ type: "spring" }}
									>
										{formatPrice(
											resolvePrice(product, userType),
										)}
									</motion.span>
									<span className="text-2xl text-muted-foreground">
										ریال
									</span>
									{(userType === "shopkeeper" ||
										userType === "shopkeeperCash" ||
										userType === "shopkeeperCheque") && (
										<span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
											قیمت نقدی
										</span>
									)}
								</div>
								{!!product.consumerPrice &&
									product.consumerPrice !==
										resolvePrice(product, userType) && (
										<p className="text-sm text-muted-foreground line-through">
											قیمت مصرف‌کننده:{" "}
											{formatPrice(product.consumerPrice)}{" "}
											ریال
										</p>
									)}
								{(userType === "shopkeeper" ||
									userType === "shopkeeperCash" ||
									userType === "shopkeeperCheque") &&
									!!product.step3Price && (
										<div className="flex items-center justify-between rounded-xl border border-dashed border-accent-gold/60 bg-accent-gold/5 px-4 py-3">
											<div>
												<p className="text-xs text-muted-foreground mb-0.5">
													قیمت چکی
												</p>
												<p className="text-lg font-semibold text-accent-gold">
													{formatPrice(
														product.step3Price,
													)}{" "}
													ریال
												</p>
											</div>
											<Link
												href="/contact"
												className="text-xs font-medium text-accent-gold border border-accent-gold/40 hover:bg-accent-gold/10 transition-colors rounded-lg px-3 py-1.5 shrink-0"
											>
												تماس با فروش
											</Link>
										</div>
									)}
							</div>

							{/* Min order notice */}
							{product.minOrder > 1 && (
								<div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
									<Package className="w-4 h-4 shrink-0" />
									<span>
										حداقل سفارش:{" "}
										{new Intl.NumberFormat("fa-IR").format(
											product.minOrder,
										)}{" "}
										عدد
									</span>
								</div>
							)}

							{/* Description */}
							{product?.description && (
								<div>
									<h3 className="text-xl font-bold mb-3">
										توضیحات محصول
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{product.description}
									</p>
								</div>
							)}

							{/* Actions */}
							<div ref={addToCartRef} className="flex gap-4">
								{!accessToken ? null : cartCount > 0 ? (
									<div className="flex-1 flex items-center justify-between rounded-xl border border-primary-rose/40 bg-primary-rose/5 px-4 py-3">
										<button
											className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary-rose hover:border-primary-rose transition-colors"
											onClick={handleRemoveFromCart}
										>
											<Minus className="w-4 h-4" />
										</button>
										<span className="text-xl font-bold">
											{cartCount}
										</span>
										<button
											className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary-rose hover:border-primary-rose transition-colors disabled:opacity-50"
											disabled={
												adding ||
												product.quantity === 0 ||
												cartCount >= product.quantity
											}
											onClick={handleAddToCart}
										>
											{adding ? (
												<div className="w-4 h-4 border-2 border-primary-rose border-t-transparent rounded-full animate-spin" />
											) : (
												<Plus className="w-4 h-4" />
											)}
										</button>
									</div>
								) : (
									<Button
										variant="luxury"
										size="lg"
										className="flex-1 gap-2"
										disabled={
											adding ||
											product.quantity === 0 ||
											cartCount >= product.quantity
										}
										onClick={handleAddToCart}
									>
										<AnimatePresence mode="wait">
											{added ? (
												<motion.div
													key="added"
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													exit={{ scale: 0 }}
													className="flex items-center gap-2"
												>
													<Check className="w-5 h-5" />
													اضافه شد!
												</motion.div>
											) : adding ? (
												<motion.div
													key="loading"
													animate={{ rotate: 360 }}
													transition={{
														repeat: Infinity,
														duration: 0.8,
														ease: "linear",
													}}
													className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
												/>
											) : (
												<motion.div
													key="add"
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													exit={{ scale: 0 }}
													className="flex items-center gap-2"
												>
													<ShoppingBag className="w-5 h-5" />
													{product.quantity === 0
														? "ناموجود"
														: "افزودن به سبد خرید"}
												</motion.div>
											)}
										</AnimatePresence>
									</Button>
								)}
							</div>
						</motion.div>
					</div>

					{/* Reviews Section */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="mt-16 border-t pt-12"
					>
						{/* Header */}
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-3">
								<MessageSquare className="w-6 h-6 text-primary-rose" />
								<h2 className="text-2xl font-bold">
									نظرات کاربران
								</h2>
								{reviews.length > 0 && (
									<span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
										{reviews.length} نظر
									</span>
								)}
							</div>

							{reviews.length > 0 && (
								<div className="flex items-center gap-2">
									<span className="text-2xl font-bold text-primary-rose">
										{(
											reviews.reduce(
												(s, r) => s + r.rating,
												0,
											) / reviews.length
										).toFixed(1)}
									</span>
									<div className="flex gap-0.5">
										{[1, 2, 3, 4, 5].map((s) => (
											<Star
												key={s}
												className={`w-4 h-4 ${
													s <=
													Math.round(
														reviews.reduce(
															(a, r) =>
																a + r.rating,
															0,
														) / reviews.length,
													)
														? "fill-amber-400 text-amber-400"
														: "text-muted-foreground"
												}`}
											/>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Submit Form */}
						{accessToken && !alreadyReviewed && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="mb-10 rounded-2xl border bg-card p-6 space-y-4"
							>
								<h3 className="font-semibold text-base">
									ثبت نظر شما
								</h3>

								<div className="flex items-center gap-1">
									{[1, 2, 3, 4, 5].map((s) => (
										<button
											key={s}
											type="button"
											onClick={() => setReviewRating(s)}
											onMouseEnter={() =>
												setHoverRating(s)
											}
											onMouseLeave={() =>
												setHoverRating(0)
											}
											className="transition-transform hover:scale-110"
										>
											<Star
												className={`w-7 h-7 transition-colors ${
													s <=
													(hoverRating ||
														reviewRating)
														? "fill-amber-400 text-amber-400"
														: "text-muted-foreground"
												}`}
											/>
										</button>
									))}
									{reviewRating > 0 && (
										<span className="mr-2 text-sm text-muted-foreground">
											{
												[
													"",
													"خیلی بد",
													"بد",
													"متوسط",
													"خوب",
													"عالی",
												][reviewRating]
											}
										</span>
									)}
								</div>

								<textarea
									value={reviewComment}
									onChange={(e) =>
										setReviewComment(e.target.value)
									}
									placeholder="نظر خود را بنویسید... (اختیاری)"
									rows={4}
									className="w-full rounded-xl border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-rose/40"
								/>

								<Button
									variant="luxury"
									className="gap-2"
									disabled={
										submittingReview || reviewRating === 0
									}
									onClick={handleSubmitReview}
								>
									{submittingReview ? (
										<motion.div
											animate={{ rotate: 360 }}
											transition={{
												repeat: Infinity,
												duration: 0.8,
												ease: "linear",
											}}
											className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
										/>
									) : (
										<Send className="w-4 h-4" />
									)}
									ثبت نظر
								</Button>
							</motion.div>
						)}

						{!accessToken && (
							<div className="mb-10 rounded-2xl border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
								برای ثبت نظر{" "}
								<Link
									href="/signin"
									className="text-primary-rose font-medium hover:underline"
								>
									وارد شوید
								</Link>
							</div>
						)}

						{alreadyReviewed && (
							<div className="mb-10 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
								<Check className="w-4 h-4" />
								نظر شما با موفقیت ثبت شد
							</div>
						)}

						{/* Reviews List */}
						{reviews.length === 0 ? (
							<div className="text-center py-16 text-muted-foreground">
								<Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
								<p>هنوز نظری ثبت نشده است</p>
							</div>
						) : (
							<div className="space-y-4">
								{reviews.map((review, i) => (
									<motion.div
										key={review.id}
										initial={{ opacity: 0, y: 12 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: i * 0.05 }}
										className="rounded-2xl border bg-card p-5"
									>
										<div className="flex items-start gap-4">
											{/* Avatar */}
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-rose/30 to-secondary-plum/30 flex items-center justify-center shrink-0 text-sm font-bold text-primary-rose">
												{review.userFirstName
													? review.userFirstName.slice(
															0,
															1,
														)
													: "ک"}
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between flex-wrap gap-2 mb-2">
													<div className="flex items-center gap-2">
														<span className="text-sm font-medium">
															{review.userFirstName ||
															review.userLastName
																? `${review.userFirstName} ${review.userLastName}`.trim()
																: "کاربر"}
														</span>
														{review.isVerified && (
															<span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
																<BadgeCheck className="w-3 h-3" />
																خریدار تایید شده
															</span>
														)}
													</div>
													<span className="text-xs text-muted-foreground">
														{new Date(
															review.createdAt,
														).toLocaleDateString(
															"fa-IR",
														)}
													</span>
												</div>

												<div className="flex gap-0.5 mb-2">
													{[1, 2, 3, 4, 5].map(
														(s) => (
															<Star
																key={s}
																className={`w-4 h-4 ${
																	s <=
																	review.rating
																		? "fill-amber-400 text-amber-400"
																		: "text-muted-foreground/30"
																}`}
															/>
														),
													)}
												</div>

												{review.comment && (
													<p className="text-sm text-muted-foreground leading-relaxed">
														{review.comment}
													</p>
												)}
											</div>
										</div>
									</motion.div>
								))}
							</div>
						)}
					</motion.div>
				</div>
			</div>

			{/* Sticky add-to-cart bar — mobile only */}
			<AnimatePresence>
				{showStickyBar && product && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 100, opacity: 0 }}
						transition={spring.default}
						className="fixed bottom-0 inset-x-0 z-40 md:hidden glass-panel px-4 py-3 flex items-center gap-3 border-t-0"
						style={{
							paddingBottom:
								"calc(env(safe-area-inset-bottom) + 0.75rem)",
						}}
					>
						<div className="flex-1 min-w-0">
							<p className="text-xs text-muted-foreground truncate">
								{product.name}
							</p>
							<p className="text-base font-bold text-primary-rose">
								{formatPrice(resolvePrice(product, userType))}{" "}
								{product.currency?.name ?? "ریال"}
							</p>
						</div>
						{accessToken &&
							(cartCount > 0 ? (
								<div className="flex items-center gap-1 shrink-0">
									<button
										className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary-rose hover:border-primary-rose transition-colors"
										onClick={handleRemoveFromCart}
									>
										<Minus className="w-4 h-4" />
									</button>
									<span className="text-base font-bold min-w-[2rem] text-center">
										{cartCount}
									</span>
									<button
										className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary-rose hover:border-primary-rose transition-colors disabled:opacity-50"
										disabled={
											adding ||
											product.quantity === 0 ||
											cartCount >= product.quantity
										}
										onClick={handleAddToCart}
									>
										{adding ? (
											<div className="w-3.5 h-3.5 border-2 border-primary-rose border-t-transparent rounded-full animate-spin" />
										) : (
											<Plus className="w-4 h-4" />
										)}
									</button>
								</div>
							) : (
								<Button
									variant="luxury"
									size="sm"
									className="shrink-0 gap-2"
									disabled={
										adding ||
										product.quantity === 0 ||
										cartCount >= product.quantity
									}
									onClick={handleAddToCart}
								>
									<AnimatePresence mode="wait">
										{added ? (
											<motion.span
												key="added"
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												exit={{ scale: 0 }}
												className="flex items-center gap-1"
											>
												<Check className="w-4 h-4" />{" "}
												اضافه شد
											</motion.span>
										) : adding ? (
											<motion.div
												key="spin"
												animate={{ rotate: 360 }}
												transition={{
													repeat: Infinity,
													duration: 0.8,
													ease: "linear",
												}}
												className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
											/>
										) : (
											<motion.span
												key="add"
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												exit={{ scale: 0 }}
												className="flex items-center gap-1"
											>
												<ShoppingBag className="w-4 h-4" />
												{product.quantity === 0
													? "ناموجود"
													: "افزودن"}
											</motion.span>
										)}
									</AnimatePresence>
								</Button>
							))}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

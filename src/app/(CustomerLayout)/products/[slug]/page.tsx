"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spring } from "@/lib/motion";
import {
	Heart,
	ShoppingBag,
	Star,
	Minus,
	Plus,
	Check,
	Share2,
	Facebook,
	Twitter,
	Instagram,
	ChevronLeft,
	Package,
	Sparkles,
	Shield,
	Truck,
	ImageIcon,
	Copy,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/useProductStore";
import { getData } from "@/services/services";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCartStore } from "@/store/useCartStore";
import useUserStore from "@/store/userStore/userStore";
import resolvePrice from "@/utils/resolvePrice";

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
	const { addItem } = useCartStore();
	const { products } = useProductStore();
	const { userType } = useUserStore();

	const getProduct = () => {
		setLoading(true);
		getData({ endPoint: `/v1/products/slug/${params.slug}` })
			.then((data) => {
				setProduct(data?.data);
			})
			.finally(() => setLoading(false));
	};
	const handleAddToCart = async () => {
		if (!product) return;
		setAdding(true);
		try {
			await addItem(product.id);
			setAdded(true);
			setTimeout(() => setAdded(false), 2000);
		} finally {
			setAdding(false);
		}
	};

	useEffect(() => {
		getProduct();
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
							<div className="flex justify-between border-b">
								<div>
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
								</div>
								<div className="flex gap-2">
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
							<div className="py-6 border-b">
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
								</div>
								{!!product.consumerPrice &&
									product.consumerPrice !==
										resolvePrice(product, userType) && (
										<p className="text-sm text-muted-foreground line-through mt-1">
											قیمت مصرف‌کننده:{" "}
											{formatPrice(product.consumerPrice)}{" "}
											ریال
										</p>
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
								<Button
									variant="luxury"
									size="lg"
									className="flex-1 gap-2"
									disabled={adding || product.quantity === 0}
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
							</div>
						</motion.div>
					</div>
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
						<Button
							variant="luxury"
							size="sm"
							className="shrink-0 gap-2"
							disabled={adding || product.quantity === 0}
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
										<Check className="w-4 h-4" /> اضافه شد
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
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/useProductStore";
import { getData } from "@/services/services";

export default function ProductDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const { products } = useProductStore();
	// const product = products.find((p) => p.slug === params.slug);
	const getProduct = () => {
		setLoading(true);
		getData({ endPoint: `/v1/product/${params.slug}` })
			.then((data) => {
				setProduct(data?.data);
			})
			.finally(() => setLoading(false));
	};
	useEffect(() => {
		getProduct();
	}, []);

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

	const images = product.productPic || [product.productPic];

	const relatedProducts = products
		.filter((p) => p.category === product.category && p.id !== product.id)
		.slice(0, 4);

	return (
		<div className="min-h-screen bg-neutral-warm dark:bg-gray-950 pt-2">
			{/* Breadcrumb */}
			<div className="bg-white dark:bg-gray-900 border-b">
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
						<span className="text-foreground">{product.name}</span>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				<div className="grid lg:grid-cols-2 gap-12 mb-16">
					{/* Product Images */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
					>
						{/* Main Image */}
						<div className="relative mb-4 rounded-2xl overflow-hidden shadow-2xl group min-h-[70vh] flex place-items-center place-content-center">
							<AnimatePresence mode="wait">
								{product?.productPic ? (
									<motion.img
										key={product.productPic}
										src={product.productPic}
										alt={product.name}
										className="w-full h-[500px] object-cover"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.3 }}
									/>
								) : (
									<ImageIcon className="w-16 h-16 text-muted-foreground" />
								)}
							</AnimatePresence>

							{product.isNew && (
								<Badge
									variant="new"
									className="absolute top-4 right-4"
								>
									<Star className="w-3 h-3 ml-1" />
									جدید
								</Badge>
							)}

							{product.quantity == 0 && (
								<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
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

						{/* Thumbnail Images */}
						{/* {images.length > 1 && (
							<div className="grid grid-cols-4 gap-4">
								{images.map((img, i) => (
									<motion.button
										key={i}
										onClick={() => setSelectedImage(i)}
										className={`relative rounded-lg overflow-hidden border-2 transition-all ${
											selectedImage === i
												? "border-primary-rose shadow-lg scale-105"
												: "border-transparent hover:border-gray-300"
										}`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<img
											src={img}
											alt={`${product.name} ${i + 1}`}
											className="w-full h-24 object-cover"
										/>
									</motion.button>
								))}
							</div>
						)} */}
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
							<Button
								variant="outline"
								size="icon"
								className="w-12 h-12"
							>
								<Share2 className="w-5 h-5" />
							</Button>
						</div>

						{/* Rating */}
						{/* {product.rating && (
							<div className="flex items-center gap-4">
								<div className="flex">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-5 h-5 ${
												i < Math.floor(product.rating!)
													? "fill-amber-500 text-amber-500"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<span className="text-muted-foreground">
									{product.rating} ({product.reviews} نظر)
								</span>
							</div>
						)} */}

						{/* Price */}
						<div className="py-6 border-b">
							<div className="flex items-baseline gap-3">
								<motion.span
									className="text-5xl font-bold text-primary-rose"
									initial={{ scale: 0.8 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring" }}
								>
									{product.price}
								</motion.span>
								<span className="text-2xl text-muted-foreground">
									تومان
								</span>
							</div>
						</div>

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
						{/* Sizes */}
						{/* {product.sizes && product.sizes.length > 0 && (
							<div>
								<h3 className="text-lg font-bold mb-3">سایز</h3>
								<div className="flex gap-3">
									{product.sizes.map((size) => (
										<Button
											key={size}
											variant={
												selectedSize === size
													? "default"
													: "outline"
											}
											onClick={() =>
												setSelectedSize(size)
											}
											className="min-w-[100px]"
										>
											{size}
										</Button>
									))}
								</div>
							</div>
						)} */}

						{/* Colors */}
						{/* {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">رنگ: {selectedColor}</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      onClick={() => setSelectedColor(color)}
                      className="min-w-[100px]"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )} */}

						{/* Quantity */}
						{/* <div>
              <h3 className="text-lg font-bold mb-3">تعداد</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {product.stock && (
                  <span className="text-sm text-muted-foreground">
                    {product.stock} عدد موجود
                  </span>
                )}
              </div>
            </div> */}

						{/* Actions */}
						{/* <div className="flex gap-4">
							<Button
                variant="luxury"
                size="lg"
                className="flex-1"
                disabled={!product.available}
                onClick={handleAddToCart}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
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
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      افزودن به سبد خرید
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              <Button
                variant={isInWishlist ? 'default' : 'outline'}
                size="icon"
                className="w-12 h-12"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart
                  className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`}
                />
              </Button>

							<Button
								variant="outline"
								size="icon"
								className="w-12 h-12"
							>
								<Share2 className="w-5 h-5" />
							</Button>
						</div> */}

						{/* Features */}
						{/* <div className="grid grid-cols-3 gap-4 pt-6">
							<div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
								<Truck className="w-8 h-8 mx-auto mb-2 text-primary-rose" />
								<p className="text-sm font-medium">
									ارسال رایگان
								</p>
							</div>
							<div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
								<Shield className="w-8 h-8 mx-auto mb-2 text-primary-rose" />
								<p className="text-sm font-medium">
									ضمانت اصالت
								</p>
							</div>
							<div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
								<Sparkles className="w-8 h-8 mx-auto mb-2 text-primary-rose" />
								<p className="text-sm font-medium">
									کیفیت برتر
								</p>
							</div>
						</div> */}
					</motion.div>
				</div>

				{/* Product Details Tabs */}
				{/* <motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<Card>
						<CardContent className="p-8">
							<div className="grid md:grid-cols-2 gap-8">
								{product.benefits && (
									<div>
										<h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
											<Sparkles className="w-6 h-6 text-primary-rose" />
											مزایا
										</h3>
										<ul className="space-y-3">
											{product.benefits.map(
												(benefit, i) => (
													<motion.li
														key={i}
														initial={{
															opacity: 0,
															x: -20,
														}}
														whileInView={{
															opacity: 1,
															x: 0,
														}}
														transition={{
															delay: i * 0.1,
														}}
														className="flex items-center gap-3"
													>
														<Check className="w-5 h-5 text-emerald-500" />
														<span>{benefit}</span>
													</motion.li>
												),
											)}
										</ul>
									</div>
								)}

								{product.ingredients && (
									<div>
										<h3 className="text-2xl font-bold mb-4">
											ترکیبات
										</h3>
										<ul className="space-y-3">
											{product.ingredients.map(
												(ingredient, i) => (
													<motion.li
														key={i}
														initial={{
															opacity: 0,
															x: -20,
														}}
														whileInView={{
															opacity: 1,
															x: 0,
														}}
														transition={{
															delay: i * 0.1,
														}}
														className="flex items-center gap-3"
													>
														<div className="w-2 h-2 rounded-full bg-accent-gold" />
														<span>
															{ingredient}
														</span>
													</motion.li>
												),
											)}
										</ul>
									</div>
								)}
							</div>

							{product.howToUse && (
								<div className="mt-8 pt-8 border-t">
									<h3 className="text-2xl font-bold mb-4">
										نحوه استفاده
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{product.howToUse}
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div> */}

				{/* Related Products */}
				{/* {relatedProducts.length > 0 && (
					<div>
						<h2 className="text-3xl font-bold mb-8">
							محصولات مرتبط
						</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
							{relatedProducts.map((relatedProduct, i) => (
								<motion.div
									key={relatedProduct.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: i * 0.1 }}
								>
									<Link
										href={`/products/${relatedProduct.id}`}
									>
										<Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
											<div className="relative h-64 overflow-hidden">
												<motion.img
													src={relatedProduct.image}
													alt={relatedProduct.name}
													className="w-full h-full object-cover"
													whileHover={{ scale: 1.1 }}
												/>
											</div>
											<CardContent className="p-4">
												<p className="text-sm text-muted-foreground">
													{relatedProduct.brand}
												</p>
												<h3 className="font-bold mb-2">
													{relatedProduct.name}
												</h3>
												<p className="text-lg font-bold text-primary-rose">
													{
														relatedProduct.priceFormatted
													}{" "}
													تومان
												</p>
											</CardContent>
										</Card>
									</Link>
								</motion.div>
							))}
						</div>
					</div>
				)} */}
			</div>
		</div>
	);
}

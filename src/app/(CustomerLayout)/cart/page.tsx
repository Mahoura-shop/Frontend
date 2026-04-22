// src/app/cart/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ShoppingCart,
	Trash2,
	Plus,
	Minus,
	ArrowLeft,
	ShoppingBag,
	Gift,
	Percent,
	Tag,
	CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock cart data
const MOCK_CART_ITEMS = [
	{
		id: 1,
		name: "رژ لب مات مخملی",
		slug: "matte-velvet-lipstick",
		price: 450000,
		image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
		brand: "Mahoura",
		quantity: 2,
		isNew: true,
	},
	{
		id: 2,
		name: "سرم ویتامین C درخشان کننده",
		slug: "vitamin-c-serum",
		price: 680000,
		image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
		brand: "Mahoura Care",
		quantity: 1,
		isNew: false,
	},
	{
		id: 3,
		name: "پالت سایه چشم گلدن گلو",
		slug: "golden-glow-eyeshadow",
		price: 890000,
		image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
		brand: "Mahoura Pro",
		quantity: 1,
		isNew: true,
	},
];

export default function CartPage() {
	const [items, setItems] = useState(MOCK_CART_ITEMS);
	const [couponCode, setCouponCode] = useState("");
	const [appliedCoupon, setAppliedCoupon] = useState<{
		code: string;
		discount: number;
	} | null>(null);

	// Cart operations
	const removeItem = (id: number) => {
		setItems(items.filter((item) => item.id !== id));
	};

	const updateQuantity = (id: number, quantity: number) => {
		if (quantity < 1) return;
		setItems(
			items.map((item) =>
				item.id === id ? { ...item, quantity } : item
			)
		);
	};

	const clearCart = () => {
		setItems([]);
	};

	// Calculate totals
	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const shipping = subtotal > 0 ? (subtotal > 500000 ? 0 : 50000) : 0;
	const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
	const tax = (subtotal - discount) * 0.09; // 9% tax
	const total = subtotal - discount + shipping + tax;

	const handleApplyCoupon = () => {
		// Mock coupon validation
		const validCoupons = {
			welcome10: 10,
			save20: 20,
			vip30: 30,
		};

		const lowerCode = couponCode.toLowerCase();
		if (lowerCode in validCoupons) {
			setAppliedCoupon({
				code: couponCode,
				discount: validCoupons[lowerCode as keyof typeof validCoupons],
			});
			alert(`کد تخفیف ${validCoupons[lowerCode as keyof typeof validCoupons]}% اعمال شد!`);
		} else {
			alert("کد تخفیف نامعتبر است");
		}
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("fa-IR").format(price);
	};

	// Empty cart state
	if (items.length === 0) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="max-w-md mx-auto text-center"
					>
						<div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 rounded-full flex items-center justify-center">
							<ShoppingCart className="w-16 h-16 text-muted-foreground" />
						</div>
						<h2 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h2>
						<p className="text-muted-foreground mb-6">
							هنوز محصولی به سبد خرید اضافه نکرده‌اید
						</p>
						<Link href="/products">
							<Button variant="luxury" className="gap-2">
								<ShoppingBag className="w-5 h-5" />
								مشاهده محصولات
							</Button>
						</Link>
					</motion.div>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-4xl font-bold gradient-text mb-2">سبد خرید</h1>
					<p className="text-muted-foreground">
						{items.length} محصول در سبد خرید شما
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2 space-y-4">
						<AnimatePresence mode="popLayout">
							{items.map((item) => (
								<motion.div
									key={item.id}
									layout
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9, x: -100 }}
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								>
									<Card className="overflow-hidden hover:shadow-lg transition-shadow">
										<CardContent className="p-4">
											<div className="flex gap-4">
												{/* Product Image */}
												<div className="relative w-24 h-24 flex-shrink-0">
													<img
														src={item.image}
														alt={item.name}
														className="w-full h-full object-cover rounded-lg"
													/>
													{item.isNew && (
														<Badge
															variant="new"
															className="absolute top-1 right-1 text-xs"
														>
															جدید
														</Badge>
													)}
												</div>

												{/* Product Info */}
												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-lg mb-1 truncate">
														{item.name}
													</h3>
													<p className="text-sm text-muted-foreground mb-2">
														{item.brand}
													</p>

													{/* Quantity Controls */}
													<div className="flex items-center gap-3">
														<div className="flex items-center gap-2 border rounded-lg p-1">
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() =>
																	updateQuantity(
																		item.id,
																		Math.max(1, item.quantity - 1)
																	)
																}
															>
																<Minus className="w-4 h-4" />
															</Button>
															<span className="w-8 text-center font-medium">
																{new Intl.NumberFormat("fa-IR").format(
																	item.quantity
																)}
															</span>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() =>
																	updateQuantity(item.id, item.quantity + 1)
																}
															>
																<Plus className="w-4 h-4" />
															</Button>
														</div>

														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
															onClick={() => removeItem(item.id)}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</div>

												{/* Price */}
												<div className="text-left">
													<p className="text-2xl font-bold gradient-text">
														{formatPrice(item.price * item.quantity)}
													</p>
													<p className="text-sm text-muted-foreground">تومان</p>
													{item.quantity > 1 && (
														<p className="text-xs text-muted-foreground mt-1">
															{formatPrice(item.price)} × {item.quantity}
														</p>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</AnimatePresence>

						{/* Clear Cart Button */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<Button
								variant="outline"
								className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
								onClick={clearCart}
							>
								<Trash2 className="w-4 h-4" />
								پاک کردن سبد خرید
							</Button>
						</motion.div>
					</div>

					{/* Order Summary */}
					<div className="lg:col-span-1">
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							className="sticky top-24 space-y-6"
						>
							<Card className="overflow-hidden border-2">
								<div className="bg-gradient-to-br from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4">
									<h2 className="text-xl font-bold flex items-center gap-2">
										<ShoppingBag className="w-5 h-5" />
										خلاصه سفارش
									</h2>
								</div>

								<CardContent className="p-6 space-y-4">
									{/* Coupon Code */}
									<div className="space-y-2">
										<label className="text-sm font-medium flex items-center gap-2">
											<Tag className="w-4 h-4" />
											کد تخفیف
										</label>
										<div className="flex gap-2">
											<input
												type="text"
												value={couponCode}
												onChange={(e) => setCouponCode(e.target.value)}
												placeholder="کد تخفیف را وارد کنید"
												className="flex-1 px-3 py-2 border rounded-lg focus:border-primary-rose focus:outline-none focus:ring-2 focus:ring-primary-rose/20"
											/>
											<Button
												variant="outline"
												onClick={handleApplyCoupon}
												disabled={!couponCode}
											>
												اعمال
											</Button>
										</div>
										{appliedCoupon && (
											<div className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
												<span className="text-sm text-green-700 dark:text-green-400">
													کد "{appliedCoupon.code}" اعمال شد
												</span>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6"
													onClick={() => {
														setAppliedCoupon(null);
														setCouponCode("");
													}}
												>
													<Trash2 className="w-3 h-3" />
												</Button>
											</div>
										)}
										<p className="text-xs text-muted-foreground">
											کدهای تخفیف: WELCOME10, SAVE20, VIP30
										</p>
									</div>

									<Separator />

									{/* Price Breakdown */}
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">جمع کل</span>
											<span className="font-medium">
												{formatPrice(subtotal)} تومان
											</span>
										</div>

										{appliedCoupon && (
											<div className="flex items-center justify-between text-green-600 dark:text-green-400">
												<span className="flex items-center gap-1">
													<Percent className="w-4 h-4" />
													تخفیف ({appliedCoupon.discount}%)
												</span>
												<span className="font-medium">
													-{formatPrice(discount)} تومان
												</span>
											</div>
										)}

										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">هزینه ارسال</span>
											<span className="font-medium">
												{shipping === 0 ? (
													<span className="text-green-600 dark:text-green-400">
														رایگان
													</span>
												) : (
													`${formatPrice(shipping)} تومان`
												)}
											</span>
										</div>

										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">مالیات (۹٪)</span>
											<span className="font-medium">
												{formatPrice(tax)} تومان
											</span>
										</div>
									</div>

									<Separator />

									{/* Total */}
									<div className="flex items-center justify-between text-xl font-bold">
										<span>مجموع نهایی</span>
										<span className="gradient-text">{formatPrice(total)}</span>
									</div>

									{/* Free Shipping Notice */}
									{shipping > 0 && (
										<div className="p-3 bg-accent-gold/10 border border-accent-gold/20 rounded-lg">
											<p className="text-sm text-center">
												با خرید{" "}
												<span className="font-bold">
													{formatPrice(500000 - subtotal)} تومان
												</span>{" "}
												بیشتر، ارسال رایگان!
											</p>
										</div>
									)}

									{/* Checkout Button */}
									<Link href="/checkout">
										<Button variant="luxury" className="w-full gap-2" size="lg">
											<CreditCard className="w-5 h-5" />
											ادامه و تکمیل خرید
										</Button>
									</Link>

									{/* Continue Shopping */}
									<Link href="/products">
										<Button variant="outline" className="w-full gap-2">
											<ArrowLeft className="w-4 h-4" />
											ادامه خرید
										</Button>
									</Link>
								</CardContent>
							</Card>

							{/* Trust Badges */}
							<Card className="p-4">
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
											<Gift className="w-5 h-5 text-green-600" />
										</div>
										<div className="flex-1">
											<p className="font-medium text-sm">ضمانت بازگشت وجه</p>
											<p className="text-xs text-muted-foreground">
												تا ۷ روز پس از خرید
											</p>
										</div>
									</div>
									<Separator />
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
											<ShoppingBag className="w-5 h-5 text-blue-600" />
										</div>
										<div className="flex-1">
											<p className="font-medium text-sm">ارسال سریع</p>
											<p className="text-xs text-muted-foreground">
												ارسال به سراسر کشور
											</p>
										</div>
									</div>
								</div>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
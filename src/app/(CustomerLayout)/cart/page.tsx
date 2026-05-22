"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spring } from "@/lib/motion";
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
	Package,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import resolvePrice from "@/utils/resolvePrice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import useUserStore from "@/store/userStore/userStore";
import { useRouter } from "next/navigation";
import { getShippingCost } from "@/services/shippingService";

const VALID_COUPONS: Record<string, number> = {
	welcome10: 10,
	save20: 20,
	vip30: 30,
};

export default function CartPage() {
	const {
		items,
		loading,
		fetchCart,
		addItem,
		removeItem,
		removeAllOfItem,
		clearCart,
	} = useCartStore();
	const { accessToken, userType, _hasHydrated } = useUserStore();

	const router = useRouter();

	useEffect(() => {
		if (!_hasHydrated) return;
		if (!accessToken) router.replace("/signin");
	}, [accessToken, _hasHydrated]);

	const [couponCode, setCouponCode] = useState("");
	const [appliedCoupon, setAppliedCoupon] = useState<{
		code: string;
		discount: number;
	} | null>(null);
	const [shippingCost, setShippingCost] = useState(0);

	useEffect(() => {
		fetchCart();
		getShippingCost().then(setShippingCost).catch(() => {});
	}, []);

	// const handleApplyCoupon = () => {
	// 	const lower = couponCode.toLowerCase();
	// 	if (lower in VALID_COUPONS) {
	// 		setAppliedCoupon({
	// 			code: couponCode,
	// 			discount: VALID_COUPONS[lower],
	// 		});
	// 	} else {
	// 		alert("کد تخفیف نامعتبر است");
	// 	}
	// };

	const subtotal = items.reduce(
		(sum, item) => sum + resolvePrice(item.product, userType) * item.count,
		0,
	);
	const shipping = subtotal > 0 ? shippingCost : 0;
	const discount = appliedCoupon
		? (subtotal * appliedCoupon.discount) / 100
		: 0;
	const tax = (subtotal - discount) * 0.09;
	const total = subtotal - discount + shipping + tax;

	if (loading && items.length === 0) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{
						repeat: Infinity,
						duration: 1,
						ease: "linear",
					}}
					className="w-10 h-10 border-4 border-primary-rose border-t-transparent rounded-full"
				/>
			</div>
		);
	}

	if (!loading && items.length === 0) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="max-w-md mx-auto text-center"
					>
						<div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 rounded-full flex items-center justify-center">
							<ShoppingCart className="w-16 h-16 text-muted-foreground" />
						</div>
						<h2 className="text-2xl font-bold mb-4">
							سبد خرید شما خالی است
						</h2>
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
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-4xl font-bold gradient-text mb-2">
						سبد خرید
					</h1>
					<p className="text-muted-foreground">
						{new Intl.NumberFormat("fa-IR").format(items.length)}{" "}
						محصول در سبد خرید شما
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-4">
						<AnimatePresence mode="popLayout">
							{items.map((item) => (
								<motion.div
									key={item.id}
									layout
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9, x: -100 }}
									transition={spring.default}
								>
									<Card className="overflow-hidden hover:shadow-lg transition-shadow">
										<CardContent className="p-4">
											<div className="flex gap-4">
												<div className="relative w-24 h-24 flex-shrink-0">
													{item.product.productPic ? (
														<img
															src={
																item.product
																	.productPic
															}
															alt={
																item.product
																	.name
															}
															className="w-full h-full object-cover rounded-lg"
														/>
													) : (
														<div className="w-full h-full rounded-lg bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 flex items-center justify-center">
															<Package className="w-8 h-8 text-muted-foreground" />
														</div>
													)}
													{item.product.isNew && (
														<Badge
															variant="new"
															className="absolute top-1 right-1 text-xs"
														>
															جدید
														</Badge>
													)}
												</div>

												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-lg mb-1 truncate">
														{item.product.name}
													</h3>
													{item.product.brand && (
														<p className="text-sm text-muted-foreground mb-2">
															{
																item.product
																	.brand.name
															}
														</p>
													)}

													<div className="flex items-center gap-3">
														<div className="flex items-center gap-2 border rounded-lg p-1">
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																disabled={
																	loading
																}
																onClick={() =>
																	removeItem(
																		item
																			.product
																			.id,
																	)
																}
															>
																<Minus className="w-4 h-4" />
															</Button>
															<span className="w-8 text-center font-medium">
																{new Intl.NumberFormat(
																	"fa-IR",
																).format(
																	item.count,
																)}
															</span>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																disabled={
																	loading
																}
																onClick={() =>
																	addItem(
																		item
																			.product
																			.id,
																	)
																}
															>
																<Plus className="w-4 h-4" />
															</Button>
														</div>

														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
															disabled={loading}
															onClick={() =>
																removeAllOfItem(
																	item.product
																		.id,
																	item.count,
																)
															}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</div>

												<div className="text-left">
													<p className="text-2xl font-bold gradient-text">
														{formatPrice(
															resolvePrice(
																item.product,
																userType,
															) * item.count,
														)}
													</p>
													<p className="text-sm text-muted-foreground">
														ریال
													</p>
													{item.count > 1 && (
														<p className="text-xs text-muted-foreground mt-1">
															{formatPrice(
																resolvePrice(
																	item.product,
																	userType,
																),
															)}{" "}
															×{" "}
															{new Intl.NumberFormat(
																"fa-IR",
															).format(
																item.count,
															)}
														</p>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</AnimatePresence>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<Button
								variant="outline"
								className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
								disabled={loading}
								onClick={clearCart}
							>
								<Trash2 className="w-4 h-4" />
								پاک کردن سبد خرید
							</Button>
						</motion.div>
					</div>

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
									{/* <div className="space-y-2">
										<label className="text-sm font-medium flex items-center gap-2">
											<Tag className="w-4 h-4" />
											کد تخفیف
										</label>
										<div className="flex gap-2">
											<input
												type="text"
												value={couponCode}
												onChange={(e) =>
													setCouponCode(
														e.target.value,
													)
												}
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
													کد "{appliedCoupon.code}"
													اعمال شد
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
									</div>

									<Separator /> */}

									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">
												جمع کل
											</span>
											<span className="font-medium">
												{formatPrice(subtotal)} ریال
											</span>
										</div>

										{/* {appliedCoupon && (
											<div className="flex items-center justify-between text-green-600 dark:text-green-400">
												<span className="flex items-center gap-1">
													<Percent className="w-4 h-4" />
													تخفیف (
													{appliedCoupon.discount}%)
												</span>
												<span className="font-medium">
													-{formatPrice(discount)}{" "}
													ریال
												</span>
											</div>
										)} */}

										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">
												هزینه ارسال
											</span>
											<span className="font-medium">
												{`${formatPrice(shipping)} ریال`}
											</span>
										</div>

										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">
												مالیات (۹٪)
											</span>
											<span className="font-medium">
												{formatPrice(tax)} ریال
											</span>
										</div>
									</div>

									<Separator />

<div className="flex flex-col gap-4">

									<div className="flex items-center justify-between text-xl font-bold ">
										<span>مجموع نهایی</span>
										<span className="gradient-text">
											{formatPrice(total)}
										</span>
									</div>


									<Link href="/order">
										<Button
											variant="luxury"
											className="w-full gap-2"
											size="lg"
										>
											<CreditCard className="w-5 h-5" />
											ادامه و تکمیل خرید
										</Button>
									</Link>

									<Link href="/products">
										<Button
											variant="outline"
											className="w-full gap-2"
										>
											<ArrowLeft className="w-4 h-4" />
											ادامه خرید
										</Button>
									</Link>
</div>
								</CardContent>
							</Card>

							<Card className="p-4">
								<div className="space-y-3">
									{/* <div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
											<Gift className="w-5 h-5 text-green-600" />
										</div>
										<div className="flex-1">
											<p className="font-medium text-sm">
												ضمانت بازگشت وجه
											</p>
											<p className="text-xs text-muted-foreground">
												تا ۷ روز پس از خرید
											</p>
										</div>
									</div>
									<Separator /> */}
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
											<ShoppingBag className="w-5 h-5 text-blue-600" />
										</div>
										<div className="flex-1">
											<p className="font-medium text-sm">
												ارسال سریع
											</p>
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

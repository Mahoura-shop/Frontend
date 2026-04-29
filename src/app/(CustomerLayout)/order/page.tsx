// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	CreditCard,
	MapPin,
	User,
	Phone,
	Mail,
	Home,
	Building2,
	FileText,
	ShoppingBag,
	Lock,
	CheckCircle2,
	ArrowRight,
	Wallet,
	Banknote,
	Calendar,
} from "lucide-react";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Input from "@/components/Custom/Input/Input";
import Textarea from "@/components/Custom/Textarea/Textarea";
import Select from "@/components/Custom/Select/Select";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { formatPrice } from "@/utils/formatPrice";

// Mock cart data
const MOCK_CART_ITEMS = [
	{
		id: 1,
		name: "رژ لب مات مخملی",
		price: 450000,
		quantity: 2,
		image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop",
	},
	{
		id: 2,
		name: "سرم ویتامین C",
		price: 680000,
		quantity: 1,
		image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop",
	},
	{
		id: 3,
		name: "پالت سایه چشم",
		price: 890000,
		quantity: 1,
		image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=100&h=100&fit=crop",
	},
];

// Validation schema
const checkoutSchema = Yup.object({
	firstName: Yup.string().required("نام الزامی است"),
	lastName: Yup.string().required("نام خانوادگی الزامی است"),
	email: Yup.string().email("ایمیل نامعتبر است").required("ایمیل الزامی است"),
	phone: Yup.string()
		.matches(/^09\d{9}$/, "شماره موبایل نامعتبر است")
		.required("شماره موبایل الزامی است"),
	province: Yup.string().required("استان را انتخاب کنید"),
	city: Yup.string().required("شهر را انتخاب کنید"),
	address: Yup.string().required("آدرس الزامی است"),
	postalCode: Yup.string()
		.matches(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد")
		.required("کد پستی الزامی است"),
	paymentMethod: Yup.string().required("روش پرداخت را انتخاب کنید"),
	notes: Yup.string(),
});

const initialValues = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	province: "",
	city: "",
	address: "",
	postalCode: "",
	paymentMethod: "",
	notes: "",
};

export default function CheckoutPage() {
	const [loading, setLoading] = useState(false);

	// Calculate totals
	const subtotal = MOCK_CART_ITEMS.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const shipping = 50000;
	const tax = subtotal * 0.09;
	const total = subtotal + shipping + tax;

	const handleSubmit = async (values: typeof initialValues) => {
		setLoading(true);

		// Mock API call
		console.log("Order Data:", values);

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setLoading(false);
		CustomToast("سفارش شما با موفقیت ثبت شد!", "success");

		// Redirect to success page
		// router.push('/order-success');
	};

	return (
		<div className="min-h-screen bg-background">

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<Link
						href="/cart"
						className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
					>
						<ArrowRight className="w-4 h-4" />
						بازگشت به سبد خرید
					</Link>
					<h1 className="text-4xl font-bold gradient-text mb-2">
						تکمیل خرید
					</h1>
					<p className="text-muted-foreground">
						اطلاعات خود را وارد کنید و سفارش را نهایی کنید
					</p>
				</motion.div>

				<Formik
					initialValues={initialValues}
					validationSchema={checkoutSchema}
					onSubmit={handleSubmit}
				>
					{({ values }) => (
						<Form>
							<div className="grid lg:grid-cols-3 gap-8">
								{/* Form Section */}
								<div className="lg:col-span-2 space-y-6">
									{/* Personal Information */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1 }}
									>
										<Card>
											<div className="bg-gradient-to-r from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
												<h2 className="text-xl font-bold flex items-center gap-2">
													<User className="w-5 h-5" />
													اطلاعات شخصی
												</h2>
											</div>
											<CardContent className="p-6 space-y-4">
												<div className="grid md:grid-cols-2 gap-4">
													<Input
														name="firstName"
														icon={User}
														label="نام"
													/>
													<Input
														name="lastName"
														icon={User}
														label="نام خانوادگی"
													/>
												</div>
												<div className="grid md:grid-cols-2 gap-4">
													<Input
														name="email"
														type="email"
														icon={Mail}
														label="ایمیل"
													/>
													<Input
														name="phone"
														icon={Phone}
														label="شماره موبایل"
														placeholder="09123456789"
													/>
												</div>
											</CardContent>
										</Card>
									</motion.div>

									{/* Shipping Address */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
									>
										<Card>
											<div className="bg-gradient-to-r from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
												<h2 className="text-xl font-bold flex items-center gap-2">
													<MapPin className="w-5 h-5" />
													آدرس تحویل
												</h2>
											</div>
											<CardContent className="p-6 space-y-4">
												<div className="grid md:grid-cols-2 gap-4">
													<Select
														name="province"
														label="استان"
														icon={Building2}
														options={[
															{
																value: "",
																label: "انتخاب استان",
															},
															{
																value: "tehran",
																label: "تهران",
															},
															{
																value: "isfahan",
																label: "اصفهان",
															},
															{
																value: "shiraz",
																label: "شیراز",
															},
															{
																value: "mashhad",
																label: "مشهد",
															},
															{
																value: "tabriz",
																label: "تبریز",
															},
														]}
													/>
													<Select
														name="city"
														label="شهر"
														icon={Home}
														options={[
															{
																value: "",
																label: "انتخاب شهر",
															},
															{
																value: "tehran",
																label: "تهران",
															},
															{
																value: "karaj",
																label: "کرج",
															},
															{
																value: "rey",
																label: "ری",
															},
														]}
													/>
												</div>
												<Textarea
													name="address"
													icon={MapPin}
													label="آدرس کامل"
													placeholder="خیابان، کوچه، پلاک، واحد"
												/>
												<Input
													name="postalCode"
													icon={Mail}
													label="کد پستی"
													placeholder="1234567890"
												/>
											</CardContent>
										</Card>
									</motion.div>

									{/* Payment Method */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.3 }}
									>
										<Card>
											<div className="bg-gradient-to-r from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
												<h2 className="text-xl font-bold flex items-center gap-2">
													<CreditCard className="w-5 h-5" />
													روش پرداخت
												</h2>
											</div>
											<CardContent className="p-6 space-y-4">
												<div className="grid md:grid-cols-2 gap-4">
													{/* Online Payment */}
													<label
														className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
															values.paymentMethod ===
															"online"
																? "border-primary-rose bg-primary-rose/5"
																: "border-border hover:border-primary-rose/50"
														}`}
													>
														<input
															type="radio"
															name="paymentMethod"
															value="online"
															className="w-5 h-5 accent-primary-rose"
														/>
														<div className="flex-1">
															<div className="flex items-center gap-2 mb-1">
																<CreditCard className="w-5 h-5 text-primary-rose" />
																<span className="font-semibold">
																	پرداخت
																	آنلاین
																</span>
															</div>
															<p className="text-xs text-muted-foreground">
																درگاه امن بانکی
															</p>
														</div>
													</label>

													{/* Cash on Delivery */}
													<label
														className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
															values.paymentMethod ===
															"cod"
																? "border-primary-rose bg-primary-rose/5"
																: "border-border hover:border-primary-rose/50"
														}`}
													>
														<input
															type="radio"
															name="paymentMethod"
															value="cod"
															className="w-5 h-5 accent-primary-rose"
														/>
														<div className="flex-1">
															<div className="flex items-center gap-2 mb-1">
																<Banknote className="w-5 h-5 text-primary-rose" />
																<span className="font-semibold">
																	پرداخت در
																	محل
																</span>
															</div>
															<p className="text-xs text-muted-foreground">
																هنگام تحویل کالا
															</p>
														</div>
													</label>

													{/* Wallet Payment */}
													<label
														className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
															values.paymentMethod ===
															"wallet"
																? "border-primary-rose bg-primary-rose/5"
																: "border-border hover:border-primary-rose/50"
														}`}
													>
														<input
															type="radio"
															name="paymentMethod"
															value="wallet"
															className="w-5 h-5 accent-primary-rose"
														/>
														<div className="flex-1">
															<div className="flex items-center gap-2 mb-1">
																<Wallet className="w-5 h-5 text-primary-rose" />
																<span className="font-semibold">
																	کیف پول
																</span>
															</div>
															<p className="text-xs text-muted-foreground">
																موجودی:
																۲,۵۰۰,۰۰۰ تومان
															</p>
														</div>
													</label>

													{/* Installment */}
													<label
														className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
															values.paymentMethod ===
															"installment"
																? "border-primary-rose bg-primary-rose/5"
																: "border-border hover:border-primary-rose/50"
														}`}
													>
														<input
															type="radio"
															name="paymentMethod"
															value="installment"
															className="w-5 h-5 accent-primary-rose"
														/>
														<div className="flex-1">
															<div className="flex items-center gap-2 mb-1">
																<Calendar className="w-5 h-5 text-primary-rose" />
																<span className="font-semibold">
																	پرداخت
																	اقساطی
																</span>
															</div>
															<p className="text-xs text-muted-foreground">
																۳، ۶، ۱۲ ماهه
															</p>
														</div>
													</label>
												</div>
											</CardContent>
										</Card>
									</motion.div>

									{/* Order Notes */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 }}
									>
										<Card>
											<div className="bg-gradient-to-r from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
												<h2 className="text-xl font-bold flex items-center gap-2">
													<FileText className="w-5 h-5" />
													یادداشت سفارش (اختیاری)
												</h2>
											</div>
											<CardContent className="p-6">
												<Textarea
													name="notes"
													icon={FileText}
													label="توضیحات"
													placeholder="نکات مهم در مورد سفارش خود را بنویسید..."
												/>
											</CardContent>
										</Card>
									</motion.div>
								</div>

								{/* Order Summary Sidebar */}
								<div className="lg:col-span-1">
									<motion.div
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										className="sticky top-24 space-y-6"
									>
										{/* Order Items */}
										<Card>
											<div className="bg-gradient-to-br from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
												<h2 className="text-xl font-bold flex items-center gap-2">
													<ShoppingBag className="w-5 h-5" />
													سفارش شما
												</h2>
											</div>
											<CardContent className="p-4 space-y-3">
												{MOCK_CART_ITEMS.map((item) => (
													<div
														key={item.id}
														className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
													>
														<img
															src={item.image}
															alt={item.name}
															className="w-16 h-16 object-cover rounded-lg"
														/>
														<div className="flex-1 min-w-0">
															<p className="font-medium text-sm truncate">
																{item.name}
															</p>
															<p className="text-xs text-muted-foreground">
																{new Intl.NumberFormat(
																	"fa-IR",
																).format(
																	item.quantity,
																)}{" "}
																×{" "}
																{formatPrice(
																	item.price,
																)}
															</p>
														</div>
														<p className="font-bold text-sm gradient-text">
															{formatPrice(
																item.price *
																	item.quantity,
															)}
														</p>
													</div>
												))}
											</CardContent>
										</Card>

										{/* Price Summary */}
										<Card>
											<CardContent className="p-6 space-y-4">
												<div className="space-y-3">
													<div className="flex items-center justify-between">
														<span className="text-muted-foreground">
															جمع کل
														</span>
														<span className="font-medium">
															{formatPrice(
																subtotal,
															)}{" "}
															تومان
														</span>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-muted-foreground">
															هزینه ارسال
														</span>
														<span className="font-medium">
															{formatPrice(
																shipping,
															)}{" "}
															تومان
														</span>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-muted-foreground">
															مالیات (۹٪)
														</span>
														<span className="font-medium">
															{formatPrice(tax)}{" "}
															تومان
														</span>
													</div>
												</div>

												<Separator />

												<div className="flex items-center justify-between text-xl font-bold">
													<span>مجموع نهایی</span>
													<span className="gradient-text">
														{formatPrice(total)}
													</span>
												</div>

												{/* Submit Button */}
												<Button
													type="submit"
													variant="luxury"
													className="w-full gap-2"
													size="lg"
													disabled={loading}
												>
													{loading ? (
														"در حال پردازش..."
													) : (
														<>
															<Lock className="w-5 h-5" />
															ثبت و پرداخت سفارش
														</>
													)}
												</Button>

												{/* Security Notice */}
												<div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
													<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
													<div className="text-xs text-muted-foreground">
														<p className="font-medium text-foreground mb-1">
															پرداخت امن
														</p>
														<p>
															تمامی پرداخت‌ها از
															طریق درگاه‌های معتبر
															بانکی انجام می‌شود
														</p>
													</div>
												</div>
											</CardContent>
										</Card>
									</motion.div>
								</div>
							</div>
						</Form>
					)}
				</Formik>
			</div>

		</div>
	);
}

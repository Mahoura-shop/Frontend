"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
	CreditCard,
	ShoppingBag,
	Lock,
	CheckCircle2,
	ArrowRight,
	Wallet,
	Package,
	MapPin,
	Plus,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import { formatPrice } from "@/utils/formatPrice"
import { useCartStore } from "@/store/useCartStore"
import { createOrder, payByWallet, initiatePayment } from "@/services/orderService"
import { getAddresses } from "@/services/addressService"
import useUserStore from "@/store/userStore/userStore"

const PAYMENT_METHOD_ONLINE = 3
const PAYMENT_METHOD_WALLET = 4

interface Address {
	id: number
	province: string
	city: string
	streetAddress: string
	postalCode: string
	houseNumber: string
	unit: number
}

export default function OrderPage() {
	const router = useRouter()
	const { items, loading, fetchCart } = useCartStore()
	const { accessToken } = useUserStore()

	useEffect(() => {
		if (!accessToken) router.replace('/signin')
	}, [accessToken])
	const [paymentMethod, setPaymentMethod] = useState<number>(PAYMENT_METHOD_ONLINE)
	const [submitting, setSubmitting] = useState(false)
	const [done, setDone] = useState(false)
	const [addresses, setAddresses] = useState<Address[]>([])
	const [selectedAddressID, setSelectedAddressID] = useState<number | null>(null)

	useEffect(() => {
		fetchCart()
		getAddresses()
			.then((res) => {
				const list: Address[] = res?.data ?? []
				setAddresses(list)
				if (list.length > 0) setSelectedAddressID(list[0].id)
			})
			.catch(() => setAddresses([]))
	}, [])

	const subtotal = items.reduce(
		(sum, item) => sum + (item.product.irrPrice ?? 0) * item.count,
		0
	)

	const handleSubmit = async () => {
		if (items.length === 0) return
		setSubmitting(true)
		try {
			const res = await createOrder({
				paymentMethod,
				...(selectedAddressID ? { addressID: selectedAddressID } : {}),
			})
			const orderID: number = res?.data?.orderID

			if (!orderID) {
				CustomToast("خطا در ثبت سفارش", "error")
				return
			}

			if (paymentMethod === PAYMENT_METHOD_WALLET) {
				await payByWallet(orderID)
				CustomToast("سفارش با موفقیت پرداخت شد!", "success")
				setDone(true)
				await fetchCart()
			} else {
				const payRes = await initiatePayment(orderID)
				const gatewayURL: string = payRes?.data?.gatewayURL
				if (gatewayURL) {
					window.location.href = gatewayURL
				} else {
					CustomToast("خطا در اتصال به درگاه پرداخت", "error")
				}
			}
		} catch {
		} finally {
			setSubmitting(false)
		}
	}

	if (loading && items.length === 0) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
					className="w-10 h-10 border-4 border-primary-rose border-t-transparent rounded-full"
				/>
			</div>
		)
	}

	if (done) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center max-w-md mx-auto p-8"
				>
					<div className="w-24 h-24 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center">
						<CheckCircle2 className="w-12 h-12 text-green-600" />
					</div>
					<h2 className="text-3xl font-bold gradient-text mb-3">سفارش ثبت شد!</h2>
					<p className="text-muted-foreground mb-6">سفارش شما با موفقیت پرداخت و ثبت شد.</p>
					<div className="flex gap-3 justify-center">
						<Link href="/dashboard/orders">
							<Button variant="outline" className="gap-2">
								<Package className="w-4 h-4" />
								پیگیری سفارش
							</Button>
						</Link>
						<Link href="/products">
							<Button variant="luxury" className="gap-2">
								<ShoppingBag className="w-5 h-5" />
								ادامه خرید
							</Button>
						</Link>
					</div>
				</motion.div>
			</div>
		)
	}

	if (!loading && items.length === 0) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center max-w-md mx-auto p-8"
				>
					<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 rounded-full flex items-center justify-center">
						<ShoppingBag className="w-12 h-12 text-muted-foreground" />
					</div>
					<h2 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h2>
					<Link href="/products">
						<Button variant="luxury" className="gap-2">
							<ShoppingBag className="w-5 h-5" />
							مشاهده محصولات
						</Button>
					</Link>
				</motion.div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
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
					<h1 className="text-4xl font-bold gradient-text mb-2">تکمیل خرید</h1>
					<p className="text-muted-foreground">آدرس تحویل و روش پرداخت را انتخاب کنید</p>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						{/* Address Selection */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.05 }}
						>
							<Card>
								<div className="bg-gradient-to-r from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
									<h2 className="text-xl font-bold flex items-center gap-2">
										<MapPin className="w-5 h-5" />
										آدرس تحویل
									</h2>
								</div>
								<CardContent className="p-4">
									{addresses.length === 0 ? (
										<div className="flex items-center justify-between gap-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
											<p className="text-sm text-amber-700 dark:text-amber-400">
												هنوز آدرسی ندارید. برای تحویل سفارش، یک آدرس اضافه کنید.
											</p>
											<Link href="/dashboard/addresses">
												<Button variant="outline" size="sm" className="gap-1 flex-shrink-0">
													<Plus className="w-3 h-3" />
													افزودن آدرس
												</Button>
											</Link>
										</div>
									) : (
										<div className="space-y-3">
											{addresses.map((address) => (
												<label
													key={address.id}
													className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
														selectedAddressID === address.id
															? "border-primary-rose bg-primary-rose/5"
															: "border-border hover:border-primary-rose/50"
													}`}
												>
													<input
														type="radio"
														name="address"
														checked={selectedAddressID === address.id}
														onChange={() => setSelectedAddressID(address.id)}
														className="w-5 h-5 accent-primary-rose mt-0.5"
													/>
													<div className="flex-1">
														<p className="font-semibold text-sm">
															{address.province}، {address.city}
														</p>
														<p className="text-xs text-muted-foreground mt-1">
															{address.streetAddress}، پلاک {address.houseNumber}
															{address.unit > 0 && `، واحد ${address.unit}`}
														</p>
														<p className="text-xs text-muted-foreground">
															کد پستی: {address.postalCode}
														</p>
													</div>
												</label>
											))}
											<Link href="/dashboard/addresses" className="text-xs text-primary-rose hover:underline flex items-center gap-1 mt-2">
												<Plus className="w-3 h-3" />
												افزودن آدرس جدید
											</Link>
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>

						{/* Payment Method */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
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
										<label
											className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
												paymentMethod === PAYMENT_METHOD_ONLINE
													? "border-primary-rose bg-primary-rose/5"
													: "border-border hover:border-primary-rose/50"
											}`}
										>
											<input
												type="radio"
												name="paymentMethod"
												checked={paymentMethod === PAYMENT_METHOD_ONLINE}
												onChange={() => setPaymentMethod(PAYMENT_METHOD_ONLINE)}
												className="w-5 h-5 accent-primary-rose"
											/>
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<CreditCard className="w-5 h-5 text-primary-rose" />
													<span className="font-semibold">پرداخت آنلاین</span>
												</div>
												<p className="text-xs text-muted-foreground">درگاه زرین‌پال</p>
											</div>
										</label>

										<label
											className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
												paymentMethod === PAYMENT_METHOD_WALLET
													? "border-primary-rose bg-primary-rose/5"
													: "border-border hover:border-primary-rose/50"
											}`}
										>
											<input
												type="radio"
												name="paymentMethod"
												checked={paymentMethod === PAYMENT_METHOD_WALLET}
												onChange={() => setPaymentMethod(PAYMENT_METHOD_WALLET)}
												className="w-5 h-5 accent-primary-rose"
											/>
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<Wallet className="w-5 h-5 text-primary-rose" />
													<span className="font-semibold">کیف پول</span>
												</div>
												<p className="text-xs text-muted-foreground">کسر از موجودی حساب</p>
											</div>
										</label>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* Order Summary */}
					<div className="lg:col-span-1">
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							className="sticky top-24 space-y-6"
						>
							<Card>
								<div className="bg-gradient-to-br from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
									<h2 className="text-xl font-bold flex items-center gap-2">
										<ShoppingBag className="w-5 h-5" />
										سفارش شما ({new Intl.NumberFormat("fa-IR").format(items.length)} محصول)
									</h2>
								</div>
								<CardContent className="p-4 space-y-3">
									{items.map((item) => (
										<div
											key={item.id}
											className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
										>
											<div className="w-14 h-14 flex-shrink-0">
												{item.product.productPic ? (
													<img
														src={item.product.productPic}
														alt={item.product.name}
														className="w-full h-full object-cover rounded-lg"
													/>
												) : (
													<div className="w-full h-full rounded-lg bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 flex items-center justify-center">
														<Package className="w-6 h-6 text-muted-foreground" />
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-medium text-sm truncate">{item.product.name}</p>
												<p className="text-xs text-muted-foreground">
													{new Intl.NumberFormat("fa-IR").format(item.count)} عدد
												</p>
											</div>
											<p className="font-bold text-sm gradient-text">
												{formatPrice((item.product.irrPrice ?? 0) * item.count)}
											</p>
										</div>
									))}
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6 space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">جمع محصولات</span>
										<span className="font-medium">{formatPrice(subtotal)} تومان</span>
									</div>
									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<span>هزینه ارسال</span>
										<span>محاسبه توسط سرور</span>
									</div>

									<Separator />

									<div className="flex items-center justify-between text-lg font-bold">
										<span>جمع کل (تقریبی)</span>
										<span className="gradient-text">{formatPrice(subtotal)}</span>
									</div>

									<Button
										variant="luxury"
										className="w-full gap-2"
										size="lg"
										onClick={handleSubmit}
										disabled={submitting || items.length === 0}
									>
										{submitting ? (
											"در حال پردازش..."
										) : (
											<>
												<Lock className="w-5 h-5" />
												ثبت و پرداخت سفارش
											</>
										)}
									</Button>

									<div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
										<CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<div className="text-xs text-muted-foreground">
											<p className="font-medium text-foreground mb-1">پرداخت امن</p>
											<p>تمامی پرداخت‌ها از طریق درگاه‌های معتبر بانکی انجام می‌شود</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	)
}

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
	Phone,
	Home,
	DollarSign,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import Input from "@/components/Custom/Input/Input"
import ProvinceCityPicker from "@/components/Custom/ProvinceCityPicker/ProvinceCityPicker"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import { formatPrice } from "@/utils/formatPrice"
import resolvePrice from "@/utils/resolvePrice"
import { useCartStore } from "@/store/useCartStore"
import { createOrder, payByWallet, initiatePayment } from "@/services/orderService"
import { getAddresses, createAddress } from "@/services/addressService"
import { getWalletBalance, depositWallet } from "@/services/walletService"
import useUserStore from "@/store/useUserStore"

const depositSchema = Yup.object({
	amount: Yup.number()
		.min(10000, "حداقل مبلغ واریز ۱۰٬۰۰۰ ریال است")
		.max(50000000, "حداکثر مبلغ واریز ۵۰٬۰۰۰٬۰۰۰ ریال است")
		.required("مبلغ الزامی است"),
})

const addressSchema = Yup.object({
	provinceID: Yup.string().required("استان را انتخاب کنید"),
	cityID: Yup.string().required("شهر را انتخاب کنید"),
	streetAddress: Yup.string().min(5, "آدرس کوتاه است").required("آدرس الزامی است"),
	postalCode: Yup.string().length(10, "کد پستی باید ۱۰ رقم باشد").required("کد پستی الزامی است"),
	houseNumber: Yup.string().required("پلاک الزامی است"),
	unit: Yup.number().min(0).required("واحد الزامی است"),
})

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
	const { accessToken, userType, _hasHydrated } = useUserStore()

	useEffect(() => {
		if (!_hasHydrated) return;
		if (!accessToken) router.replace('/signin')
	}, [accessToken, _hasHydrated])
	const [paymentMethod, setPaymentMethod] = useState<number>(PAYMENT_METHOD_ONLINE)
	const [submitting, setSubmitting] = useState(false)
	const [done, setDone] = useState(false)
	const [addresses, setAddresses] = useState<Address[]>([])
	const [selectedAddressID, setSelectedAddressID] = useState<number | null>(null)
	const [addDialogOpen, setAddDialogOpen] = useState(false)
	const [addSubmitting, setAddSubmitting] = useState(false)
	const [walletBalance, setWalletBalance] = useState<number | null>(null)
	const [depositDialogOpen, setDepositDialogOpen] = useState(false)
	const [depositSubmitting, setDepositSubmitting] = useState(false)

	const fetchAddresses = () =>
		getAddresses()
			.then((res) => {
				const list: Address[] = res?.data ?? []
				setAddresses(list)
				if (list.length > 0) setSelectedAddressID(list[0].id)
			})
			.catch(() => setAddresses([]))

	const handleCreateAddress = async (values: {
		provinceID: string
		cityID: string
		streetAddress: string
		postalCode: string
		houseNumber: string
		unit: string
	}) => {
		setAddSubmitting(true)
		try {
			await createAddress({
				provinceID: Number(values.provinceID),
				cityID: Number(values.cityID),
				streetAddress: values.streetAddress,
				postalCode: values.postalCode,
				houseNumber: values.houseNumber,
				unit: Number(values.unit),
			})
			CustomToast("آدرس با موفقیت اضافه شد", "success")
			setAddDialogOpen(false)
			const res = await getAddresses()
			const list: Address[] = res?.data ?? []
			setAddresses(list)
			if (list.length > 0) setSelectedAddressID(list[list.length - 1].id)
		} catch {
		} finally {
			setAddSubmitting(false)
		}
	}

	const handleDeposit = async (values: { amount: string }) => {
		setDepositSubmitting(true)
		try {
			await depositWallet(Number(values.amount))
			const balRes = await getWalletBalance()
			setWalletBalance(balRes?.data?.balance ?? walletBalance)
			CustomToast("کیف پول با موفقیت شارژ شد", "success")
			setDepositDialogOpen(false)
		} catch {
		} finally {
			setDepositSubmitting(false)
		}
	}

	useEffect(() => {
		fetchCart()
		fetchAddresses()
		getWalletBalance()
			.then((res) => setWalletBalance(res?.data?.balance ?? 0))
			.catch(() => setWalletBalance(0))
	}, [])

	const subtotal = items.reduce(
		(sum, item) => sum + resolvePrice(item.product, userType) * item.count,
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
					CustomToast("سفارش با موفقیت پرداخت شد!", "success")
					setDone(true)
					await fetchCart()
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
		<>
		<div className="min-h-screen bg-background mt-20">
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
											<Button variant="outline" size="sm" className="gap-1 flex-shrink-0" onClick={() => setAddDialogOpen(true)}>
												<Plus className="w-3 h-3" />
												افزودن آدرس
											</Button>
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
											<button type="button" onClick={() => setAddDialogOpen(true)} className="text-xs text-primary-rose hover:underline flex items-center gap-1 mt-2">
												<Plus className="w-3 h-3" />
												افزودن آدرس جدید
											</button>
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

									{paymentMethod === PAYMENT_METHOD_WALLET && walletBalance !== null && (
										<div className={`flex items-center justify-between gap-4 p-3 rounded-lg border ${walletBalance >= subtotal ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
											<div>
												<p className="text-sm font-medium">
													موجودی کیف پول: {formatPrice(walletBalance)} ریال
												</p>
												{walletBalance < subtotal && (
													<p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
														کسری: {formatPrice(subtotal - walletBalance)} ریال
													</p>
												)}
											</div>
											{walletBalance < subtotal && (
												<Button variant="outline" size="sm" className="gap-1 flex-shrink-0" onClick={() => setDepositDialogOpen(true)}>
													<Plus className="w-3 h-3" />
													شارژ کیف پول
												</Button>
											)}
										</div>
									)}

									{(userType === "shopkeeper" ||
										userType === "shopkeeperCash" ||
										userType === "shopkeeperCheque") && (
										<div className="flex items-center gap-4 rounded-xl border border-dashed border-accent-gold/60 bg-accent-gold/5 px-4 py-3">
											<Phone className="w-5 h-5 text-accent-gold shrink-0" />
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium">
													پرداخت چکی؟
												</p>
												<p className="text-xs text-muted-foreground">
													برای خرید با چک با تیم فروش تماس بگیرید و از قیمت چکی بهره‌مند شوید.
												</p>
											</div>
											<Link
												href="/contact"
												className="text-xs font-medium text-accent-gold border border-accent-gold/40 hover:bg-accent-gold/10 transition-colors rounded-lg px-3 py-1.5 shrink-0"
											>
												تماس با ما
											</Link>
										</div>
									)}
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
												{formatPrice(resolvePrice(item.product, userType) * item.count)}
											</p>
										</div>
									))}
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6 space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">جمع محصولات</span>
										<span className="font-medium">{formatPrice(subtotal)} ریال</span>
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
										disabled={submitting || items.length === 0 || (paymentMethod === PAYMENT_METHOD_WALLET && walletBalance !== null && walletBalance < subtotal)}
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

		<Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>شارژ کیف پول</DialogTitle>
				</DialogHeader>
				<Formik
					initialValues={{ amount: "" }}
					validationSchema={depositSchema}
					onSubmit={handleDeposit}
				>
					<Form className="space-y-4">
						<Input
							name="amount"
							type="text"
							isPriceInput
							icon={DollarSign}
							label="مبلغ (ریال)"
							placeholder="۱۰۰,۰۰۰"
						/>
						<div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
							<p className="text-sm text-blue-700 dark:text-blue-400">
								حداقل مبلغ شارژ: ۱۰٬۰۰۰ ریال
								<br />
								حداکثر مبلغ شارژ: ۵۰٬۰۰۰٬۰۰۰ ریال
							</p>
						</div>
						<div className="flex gap-3">
							<Button type="button" variant="outline" className="flex-1" onClick={() => setDepositDialogOpen(false)}>
								انصراف
							</Button>
							<Button type="submit" variant="luxury" className="flex-1" disabled={depositSubmitting}>
								{depositSubmitting ? "در حال پردازش..." : "پرداخت"}
							</Button>
						</div>
					</Form>
				</Formik>
			</DialogContent>
		</Dialog>

		<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>افزودن آدرس جدید</DialogTitle>
				</DialogHeader>
				<Formik
					initialValues={{
						provinceID: "",
						cityID: "",
						streetAddress: "",
						postalCode: "",
						houseNumber: "",
						unit: "0",
					}}
					validationSchema={addressSchema}
					onSubmit={handleCreateAddress}
				>
					<Form className="space-y-4">
						<ProvinceCityPicker />
						<Input
							name="streetAddress"
							label="آدرس خیابان"
							placeholder="خیابان، کوچه، بن‌بست..."
							icon={Home}
						/>
						<div className="grid grid-cols-2 gap-3">
							<Input
								name="houseNumber"
								label="پلاک"
								placeholder="۱۲"
								icon={Home}
							/>
							<Input
								name="unit"
								type="number"
								label="واحد"
								placeholder="۳"
								icon={Home}
							/>
						</div>
						<Input
							name="postalCode"
							label="کد پستی"
							placeholder="۱۲۳۴۵۶۷۸۹۰"
							icon={MapPin}
						/>
						<div className="flex gap-3 pt-2">
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={() => setAddDialogOpen(false)}
							>
								انصراف
							</Button>
							<Button
								type="submit"
								variant="luxury"
								className="flex-1"
								disabled={addSubmitting}
							>
								{addSubmitting ? "در حال ذخیره..." : "ذخیره آدرس"}
							</Button>
						</div>
					</Form>
				</Formik>
			</DialogContent>
		</Dialog>
		</>
	)
}

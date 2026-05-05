"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Plus, Trash2, Home, CheckCircle2 } from "lucide-react"
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
	DialogTrigger,
} from "@/components/ui/dialog"
import Input from "@/components/Custom/Input/Input"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import { getAddresses, createAddress } from "@/services/addressService"

interface Address {
	id: number
	province: string
	city: string
	streetAddress: string
	postalCode: string
	houseNumber: string
	unit: number
}

const schema = Yup.object({
	provinceID: Yup.number().min(1, "شماره استان الزامی است").required("شماره استان الزامی است"),
	cityID: Yup.number().min(1, "شماره شهر الزامی است").required("شماره شهر الزامی است"),
	streetAddress: Yup.string().min(5, "آدرس کوتاه است").required("آدرس الزامی است"),
	postalCode: Yup.string().length(10, "کد پستی باید ۱۰ رقم باشد").required("کد پستی الزامی است"),
	houseNumber: Yup.string().required("پلاک الزامی است"),
	unit: Yup.number().min(0).required("واحد الزامی است"),
})

export default function AddressesPage() {
	const [addresses, setAddresses] = useState<Address[]>([])
	const [loading, setLoading] = useState(true)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	const fetchAddresses = async () => {
		try {
			const res = await getAddresses()
			setAddresses(res?.data ?? [])
		} catch {
			setAddresses([])
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAddresses()
	}, [])

	const handleCreate = async (values: {
		provinceID: string
		cityID: string
		streetAddress: string
		postalCode: string
		houseNumber: string
		unit: string
	}) => {
		setSubmitting(true)
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
			setDialogOpen(false)
			await fetchAddresses()
		} catch {
		} finally {
			setSubmitting(false)
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
					className="w-10 h-10 border-4 border-primary-rose border-t-transparent rounded-full"
				/>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center justify-between"
			>
				<div>
					<h1 className="text-2xl font-bold gradient-text mb-1">آدرس‌های من</h1>
					<p className="text-sm text-muted-foreground">
						{new Intl.NumberFormat("fa-IR").format(addresses.length)} آدرس ذخیره شده
					</p>
				</div>

				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button variant="luxury" className="gap-2">
							<Plus className="w-4 h-4" />
							افزودن آدرس
						</Button>
					</DialogTrigger>
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
							validationSchema={schema}
							onSubmit={handleCreate}
						>
							<Form className="space-y-4">
								<div className="grid grid-cols-2 gap-3">
									<Input
										name="provinceID"
										type="number"
										label="شناسه استان"
										placeholder="مثال: ۵"
										icon={MapPin}
									/>
									<Input
										name="cityID"
										type="number"
										label="شناسه شهر"
										placeholder="مثال: ۴۲"
										icon={MapPin}
									/>
								</div>
								<div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-700 dark:text-amber-400">
									برای یافتن شناسه استان و شهر، با پشتیبانی تماس بگیرید
								</div>
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
										onClick={() => setDialogOpen(false)}
									>
										انصراف
									</Button>
									<Button
										type="submit"
										variant="luxury"
										className="flex-1"
										disabled={submitting}
									>
										{submitting ? "در حال ذخیره..." : "ذخیره آدرس"}
									</Button>
								</div>
							</Form>
						</Formik>
					</DialogContent>
				</Dialog>
			</motion.div>

			{addresses.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center py-20"
				>
					<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 rounded-full flex items-center justify-center">
						<MapPin className="w-12 h-12 text-muted-foreground" />
					</div>
					<h2 className="text-xl font-bold mb-3">هنوز آدرسی ندارید</h2>
					<p className="text-muted-foreground mb-6 text-sm">
						برای تکمیل خرید، یک آدرس تحویل اضافه کنید
					</p>
					<Button variant="luxury" className="gap-2" onClick={() => setDialogOpen(true)}>
						<Plus className="w-4 h-4" />
						افزودن اولین آدرس
					</Button>
				</motion.div>
			) : (
				<div className="space-y-3">
					{addresses.map((address, index) => (
						<motion.div
							key={address.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
						>
							<Card className="hover:shadow-md transition-shadow">
								<CardContent className="p-4">
									<div className="flex items-start gap-4">
										<div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-primary-rose/20 to-accent-gold/20 flex items-center justify-center mt-1">
											<MapPin className="w-5 h-5 text-primary-rose" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-semibold mb-1">
												{address.province}، {address.city}
											</p>
											<p className="text-sm text-muted-foreground">
												{address.streetAddress}، پلاک {address.houseNumber}
												{address.unit > 0 && `، واحد ${new Intl.NumberFormat("fa-IR").format(address.unit)}`}
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												کد پستی: {address.postalCode}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			)}
		</div>
	)
}

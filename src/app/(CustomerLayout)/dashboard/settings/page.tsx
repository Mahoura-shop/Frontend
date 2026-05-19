"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { Shield, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Input from "@/components/Custom/Input/Input"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import Button from "@/components/Custom/Button/Button"
import { getMyProfile, updateMyProfile } from "@/services/userService"

interface Profile {
	id: number
	firstName: string
	lastName: string
	phone: string
	email: string
	type: string
	status: string
}

const TYPE_LABELS: Record<string, string> = {
	regular: "مشتری",
	shopkeeperCheque: "فروشنده (چکی)",
	shopkeeperCash: "فروشنده (نقدی)",
	fellow: "همکار",
	admin: "مدیر",
}

const schema = Yup.object({
	firstName: Yup.string().max(50, "حداکثر ۵۰ کاراکتر"),
	lastName: Yup.string().max(50, "حداکثر ۵۰ کاراکتر"),
})

export default function SettingsPage() {
	const [profile, setProfile] = useState<Profile | null | undefined>(undefined)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		getMyProfile()
			.then((res) => setProfile(res?.data ?? null))
			.catch(() => setProfile(null))
	}, [])

	if (profile === undefined) {
		return (
			<div className="space-y-6">
				<div>
					<Skeleton className="h-8 w-44 mb-1" />
					<Skeleton className="h-4 w-56" />
				</div>
				<Card className="overflow-hidden">
					<CardContent className="p-5">
						<div className="flex items-center gap-4">
							<Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
							<div className="space-y-2">
								<Skeleton className="h-3 w-20" />
								<Skeleton className="h-6 w-32" />
							</div>
							<div className="ms-auto">
								<Skeleton className="h-4 w-28" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<Skeleton className="h-5 w-28" />
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Skeleton className="h-10 w-full rounded-md" />
							<Skeleton className="h-10 w-full rounded-md" />
						</div>
						<div className="flex justify-end">
							<Skeleton className="h-9 w-32 rounded-md" />
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (profile === null) {
		return (
			<div className="space-y-4">
				<h1 className="text-2xl font-bold gradient-text">تنظیمات حساب</h1>
				<p className="text-muted-foreground text-sm">خطا در بارگذاری اطلاعات</p>
			</div>
		)
	}

	const handleSave = async (values: { firstName: string; lastName: string }) => {
		setSaving(true)
		try {
			const res = await updateMyProfile(values)
			setProfile((prev) => prev ? { ...prev, ...res?.data } : prev)
			CustomToast("اطلاعات با موفقیت ذخیره شد", "success")
		} catch {
		} finally {
			setSaving(false)
		}
	}

	return (
		<div className="space-y-6">
			<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
				<h1 className="text-2xl font-bold gradient-text mb-1">تنظیمات حساب</h1>
				<p className="text-sm text-muted-foreground">اطلاعات حساب کاربری خود را تکمیل کنید</p>
			</motion.div>

			{/* Account type banner */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
				<Card className="overflow-hidden relative">
					<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10" />
					<CardContent className="relative p-5 flex items-center gap-4">
						<div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-rose to-secondary-plum flex items-center justify-center flex-shrink-0">
							<Shield className="w-7 h-7 text-white" />
						</div>
						<div>
							<p className="text-xs text-muted-foreground mb-1">نوع حساب</p>
							<div className="flex items-center gap-2">
								<p className="text-lg font-bold">{TYPE_LABELS[profile.type] ?? profile.type}</p>
								<Badge variant={profile.status === "active" ? "available" : "secondary"} className="text-xs">
									{profile.status === "active" ? "فعال" : profile.status}
								</Badge>
							</div>
						</div>
						<div className="ms-auto flex items-center gap-2 text-sm text-muted-foreground">
							<Phone className="w-4 h-4" />
							<span dir="ltr">{profile.phone}</span>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Editable form */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
				<Card>
					<CardHeader>
						<CardTitle>اطلاعات شخصی</CardTitle>
					</CardHeader>
					<CardContent>
						<Formik
							initialValues={{
								firstName: profile.firstName ?? "",
								lastName: profile.lastName ?? "",
							}}
							validationSchema={schema}
							onSubmit={handleSave}
							enableReinitialize
						>
							<Form className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<Input
										name="firstName"
										label="نام"
										placeholder="نام خود را وارد کنید"
									/>
									<Input
										name="lastName"
										label="نام خانوادگی"
										placeholder="نام خانوادگی خود را وارد کنید"
									/>
								</div>
								<div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground">
									شماره تماس قابل تغییر نیست — برای تغییر با پشتیبانی تماس بگیرید
								</div>
								<div className="flex justify-end">
									<Button
										type="submit"
										loading={saving}
										className="bg-primary-rose hover:bg-primary-rose/80 text-black min-w-32"
									>
										ذخیره تغییرات
									</Button>
								</div>
							</Form>
						</Formik>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}

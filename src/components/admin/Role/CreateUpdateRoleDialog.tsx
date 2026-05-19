"use client"

import { useState } from "react"
import { Formik, Form } from "formik"
import { Pencil, Plus, ShieldCheck } from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import Input from "@/components/Custom/Input/Input"
import Textarea from "@/components/Custom/Textarea/Textarea"
import CheckboxFree from "@/components/Custom/Checkbox/CheckboxFree"
import StickyDialogFooter from "@/components/StickyDialogFooter/StickyDialogFooter"
import Button from "@/components/Custom/Button/Button"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import { roleSchema, roleInitialValues } from "@/schemas/RoleSchemas"
import { createRole, updateRole } from "@/services/roleService"

interface Permission {
	id: number
	name: string
	description: string
	category: string
}

interface Role {
	id: number
	name: string
	description: string
	permissions: Permission[]
}

interface Props {
	mode: "create" | "update"
	role?: Role
	permissions: Permission[]
	onDone: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
	product: "محصولات",
	category: "دسته‌بندی‌ها",
	brand: "برندها",
	order: "سفارشات",
	users: "کاربران",
	rbac: "نقش‌ها و دسترسی‌ها",
	contact: "پیام‌های تماس",
	update: "به‌روزرسانی",
}

function groupByCategory(permissions: Permission[]): Record<string, Permission[]> {
	const grouped: Record<string, Permission[]> = {}
	for (const perm of permissions) {
		const cat = perm.category || "other"
		if (!grouped[cat]) grouped[cat] = []
		grouped[cat].push(perm)
	}
	return grouped
}

export default function CreateUpdateRoleDialog({ mode, role, permissions, onDone }: Props) {
	const isMobile = useIsMobile()
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [selectedIDs, setSelectedIDs] = useState<number[]>(
		role?.permissions.map((p) => p.id) ?? []
	)

	const grouped = groupByCategory(permissions)

	const togglePermission = (id: number) => {
		setSelectedIDs((prev) =>
			prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
		)
	}

	const toggleCategory = (catPerms: Permission[]) => {
		const catIDs = catPerms.map((p) => p.id)
		const allSelected = catIDs.every((id) => selectedIDs.includes(id))
		if (allSelected) {
			setSelectedIDs((prev) => prev.filter((id) => !catIDs.includes(id)))
		} else {
			setSelectedIDs((prev) => [...new Set([...prev, ...catIDs])])
		}
	}

	const handleOpen = (val: boolean) => {
		if (val) {
			setSelectedIDs(role?.permissions.map((p) => p.id) ?? [])
		}
		setOpen(val)
	}

	const handleSubmit = async (values: { name: string; description: string }) => {
		setLoading(true)
		try {
			const payload = { ...values, permissionIDs: selectedIDs }
			if (mode === "create") {
				await createRole(payload)
				CustomToast("نقش ایجاد شد", "success")
			} else if (role) {
				await updateRole(role.id, payload)
				CustomToast("نقش ویرایش شد", "success")
			}
			setOpen(false)
			onDone()
		} finally {
			setLoading(false)
		}
	}

	const title = mode === "create" ? "ایجاد نقش جدید" : "ویرایش نقش"

	const trigger =
		mode === "create" ? (
			<Button className="gap-2">
				<Plus className="w-4 h-4" />
				نقش جدید
			</Button>
		) : (
			<Button size="icon" variant="secondary" className="h-8 w-8 hover:bg-background/80">
				<Pencil className="w-4 h-4" />
			</Button>
		)

	const permissionsBlock = (
		<div className="space-y-3">
			<p className="text-sm font-medium">دسترسی‌ها</p>
			<div className="space-y-4 border rounded-md p-3 max-h-64 overflow-y-auto">
				{Object.entries(grouped).map(([cat, catPerms]) => {
					const catIDs = catPerms.map((p) => p.id)
					const allSelected = catIDs.every((id) => selectedIDs.includes(id))
					const someSelected = catIDs.some((id) => selectedIDs.includes(id))
					return (
						<div key={cat} className="space-y-2">
							<div className="flex items-center gap-2 border-b pb-1">
								<CheckboxFree
									checked={allSelected}
									onValueChange={() => toggleCategory(catPerms)}
									label={CATEGORY_LABELS[cat] ?? cat}
								/>
								{someSelected && !allSelected && (
									<span className="text-xs text-muted-foreground">(بخشی)</span>
								)}
							</div>
							<div className="pr-4 space-y-2">
								{catPerms.map((perm) => (
									<CheckboxFree
										key={perm.id}
										checked={selectedIDs.includes(perm.id)}
										onValueChange={() => togglePermission(perm.id)}
										label={perm.description || perm.name}
									/>
								))}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)

	const formContent = (
		<Formik
			initialValues={
				mode === "update" && role
					? { name: role.name, description: role.description }
					: roleInitialValues
			}
			validationSchema={roleSchema}
			onSubmit={handleSubmit}
			enableReinitialize
		>
			<Form className="grid gap-4">
				{isMobile ? (
					<DrawerHeader className="px-0 pt-2">
						<DrawerTitle>{title}</DrawerTitle>
					</DrawerHeader>
				) : (
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>
				)}

				<Input name="name" icon={ShieldCheck} label="نام نقش" />
				<Textarea name="description" label="توضیحات" />

				{permissions.length > 0 && permissionsBlock}

				{isMobile ? (
					<div className="sticky bottom-0 py-4 bg-background flex flex-col gap-2 z-10">
						<Button
							className="bg-primary-rose hover:bg-primary-rose/80 text-black w-full"
							type="submit"
							loading={loading}
						>
							{mode === "create" ? "ایجاد" : "ذخیره"}
						</Button>
						<Button
							onClick={() => setOpen(false)}
							type="button"
							variant="outline"
							className="w-full"
						>
							انصراف
						</Button>
					</div>
				) : (
					<StickyDialogFooter>
						<div className="flex gap-4">
							<Button type="button" onClick={() => setOpen(false)}>
								انصراف
							</Button>
							<Button
								type="submit"
								loading={loading}
								className="bg-primary-rose hover:bg-primary-rose/80 text-black"
							>
								{mode === "create" ? "ایجاد" : "ذخیره"}
							</Button>
						</div>
					</StickyDialogFooter>
				)}
			</Form>
		</Formik>
	)

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={handleOpen}>
				<DrawerTrigger asChild>{trigger}</DrawerTrigger>
				<DrawerContent className="max-h-[90vh]">
					<div className="flex-1 overflow-y-auto overscroll-contain px-4">
						{formContent}
					</div>
				</DrawerContent>
			</Drawer>
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent variant="action">{formContent}</DialogContent>
		</Dialog>
	)
}

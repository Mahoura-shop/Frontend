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

export default function CreateUpdateRoleDialog({ mode, role, permissions, onDone }: Props) {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [selectedIDs, setSelectedIDs] = useState<number[]>(
		role?.permissions.map((p) => p.id) ?? []
	)

	const togglePermission = (id: number) => {
		setSelectedIDs((prev) =>
			prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
		)
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

	return (
		<Dialog open={open} onOpenChange={handleOpen}>
			<DialogTrigger>
				{mode === "create" ? (
					<Button className="gap-2">
						<Plus className="w-4 h-4" />
						نقش جدید
					</Button>
				) : (
					<Button size="icon" variant="secondary" className="h-8 w-8 hover:bg-background/80">
						<Pencil className="w-4 h-4" />
					</Button>
				)}
			</DialogTrigger>

			<DialogContent variant="action">
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
						<DialogHeader>
							<DialogTitle>
								{mode === "create" ? "ایجاد نقش جدید" : "ویرایش نقش"}
							</DialogTitle>
						</DialogHeader>

						<Input name="name" icon={ShieldCheck} label="نام نقش" />
						<Textarea name="description" label="توضیحات" />

						{permissions.length > 0 && (
							<div className="space-y-2">
								<p className="text-sm font-medium">دسترسی‌ها</p>
								<div className="max-h-52 overflow-y-auto space-y-3 border rounded-md p-3">
									{permissions.map((perm) => (
										<CheckboxFree
											key={perm.id}
											checked={selectedIDs.includes(perm.id)}
											onValueChange={() => togglePermission(perm.id)}
											label={perm.description ? `${perm.name} — ${perm.description}` : perm.name}
										/>
									))}
								</div>
							</div>
						)}

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
					</Form>
				</Formik>
			</DialogContent>
		</Dialog>
	)
}

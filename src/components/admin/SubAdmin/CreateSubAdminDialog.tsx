"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import InputFree from "@/components/Custom/Input/InputFree"
import { createSubAdmin } from "@/services/userService"

interface Role {
	id: number
	name: string
}

interface Props {
	roles: Role[]
	onDone: () => void
}

export default function CreateSubAdminDialog({ roles, onDone }: Props) {
	const [open, setOpen] = useState(false)
	const [phone, setPhone] = useState("")
	const [roleID, setRoleID] = useState("")
	const [loading, setLoading] = useState(false)

	const handleCreate = async () => {
		if (!phone || !roleID) return
		setLoading(true)
		try {
			await createSubAdmin(phone, Number(roleID))
			CustomToast("زیرمدیر ایجاد شد", "success")
			setOpen(false)
			setPhone("")
			setRoleID("")
			onDone()
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<UserPlus className="w-4 h-4" />
					افزودن زیرمدیر
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>افزودن زیرمدیر</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-2">
					<InputFree
						label="شماره موبایل"
						value={phone}
						onValueChange={setPhone}
					/>
					<Select value={roleID} onValueChange={setRoleID}>
						<SelectTrigger>
							<SelectValue placeholder="انتخاب نقش" />
						</SelectTrigger>
						<SelectContent>
							{roles.map((r) => (
								<SelectItem key={r.id} value={String(r.id)}>
									{r.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
						انصراف
					</Button>
					<Button onClick={handleCreate} disabled={loading || !phone || !roleID}>
						{loading ? "در حال ایجاد..." : "ایجاد"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

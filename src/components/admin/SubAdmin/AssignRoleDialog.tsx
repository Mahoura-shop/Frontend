"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
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
import { assignSubAdminRole } from "@/services/userService"

interface Role {
	id: number
	name: string
}

interface Props {
	userID: number
	currentRoleID: number | null
	roles: Role[]
	onDone: () => void
}

export default function AssignRoleDialog({ userID, currentRoleID, roles, onDone }: Props) {
	const [open, setOpen] = useState(false)
	const [roleID, setRoleID] = useState(currentRoleID ? String(currentRoleID) : "")
	const [loading, setLoading] = useState(false)

	const handleAssign = async () => {
		if (!roleID) return
		setLoading(true)
		try {
			await assignSubAdminRole(userID, Number(roleID))
			CustomToast("نقش تغییر کرد", "success")
			setOpen(false)
			onDone()
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="secondary" className="h-8 w-8">
					<Pencil className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>تغییر نقش زیرمدیر</DialogTitle>
				</DialogHeader>
				<div className="py-2">
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
					<Button onClick={handleAssign} disabled={loading || !roleID}>
						{loading ? "در حال ذخیره..." : "ذخیره"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

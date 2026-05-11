"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import { deleteRole } from "@/services/roleService"

interface Props {
	id: number
	name: string
	onDone: () => void
}

export default function DeleteRoleDialog({ id, name, onDone }: Props) {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleDelete = async () => {
		setLoading(true)
		try {
			await deleteRole(id)
			CustomToast("نقش حذف شد", "success")
			setOpen(false)
			onDone()
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<Button size="icon" variant="secondary" className="h-8 w-8 text-red-500 hover:bg-background/80">
					<Trash2 className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-xl pb-4">
				<DialogHeader>
					<DialogTitle>حذف نقش</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					نقش «{name}» حذف خواهد شد. این عمل قابل بازگشت نیست.
				</DialogDescription>
				<DialogFooter>
					<div className="flex gap-4">
						<Button onClick={() => setOpen(false)} disabled={loading}>
							انصراف
						</Button>
						<Button
							className="bg-red-600 hover:bg-red-600/80 text-white"
							onClick={handleDelete}
							disabled={loading}
						>
							{loading ? "در حال حذف..." : "حذف"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

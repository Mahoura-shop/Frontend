"use client"

import { useState } from "react"
import { ShieldOff } from "lucide-react"
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
import { revokeSubAdmin } from "@/services/userService"

interface Props {
	userID: number
	name: string
	onDone: () => void
}

export default function RevokeSubAdminDialog({ userID, name, onDone }: Props) {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleRevoke = async () => {
		setLoading(true)
		try {
			await revokeSubAdmin(userID)
			CustomToast("دسترسی مدیریت لغو شد", "success")
			setOpen(false)
			onDone()
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="secondary" className="h-8 w-8 text-red-500 hover:bg-background/80">
					<ShieldOff className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>لغو دسترسی مدیریت</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					دسترسی مدیریت «{name}» لغو خواهد شد. این کاربر دیگر زیرمدیر نخواهد بود.
				</DialogDescription>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
						انصراف
					</Button>
					<Button
						className="bg-red-600 hover:bg-red-600/80 text-white"
						onClick={handleRevoke}
						disabled={loading}
					>
						{loading ? "در حال لغو..." : "لغو دسترسی"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

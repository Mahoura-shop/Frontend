"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Users, ShieldCheck, Ban, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import InputFree from "@/components/Custom/Input/InputFree"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"
import {
	getUsers,
	banUser,
	unbanUser,
	changeUserType,
	getUserAuditLogs,
} from "@/services/userService"

interface UserItem {
	id: number
	firstName: string
	lastName: string
	phone: string
	email: string
	status: string
	type: string
}

interface AuditLog {
	id: number
	oldType: string
	newType: string
	reason: string
	changedAt: string
}

const TYPE_LABELS: Record<string, string> = {
	guest: "مهمان",
	regular: "مشتری",
	shopkeeperCheque: "فروشنده (چکی)",
	shopkeeperCash: "فروشنده (نقدی)",
	fellow: "همکار",
	admin: "مدیر",
}

const TYPE_OPTIONS = [
	{ value: "guest", label: "مهمان" },
	{ value: "regular", label: "مشتری" },
	{ value: "shopkeeperCheque", label: "فروشنده (چکی)" },
	{ value: "shopkeeperCash", label: "فروشنده (نقدی)" },
	{ value: "fellow", label: "همکار" },
]

export default function AdminUsersPage() {
	const [users, setUsers] = useState<UserItem[] | null>(null)
	const [search, setSearch] = useState("")
	const [expandedID, setExpandedID] = useState<number | null>(null)
	const [auditLogs, setAuditLogs] = useState<Record<number, AuditLog[]>>({})
	const [auditLoading, setAuditLoading] = useState<number | null>(null)
	const [roleDialog, setRoleDialog] = useState<{ open: boolean; user: UserItem | null }>({ open: false, user: null })
	const [newType, setNewType] = useState("")
	const [reason, setReason] = useState("")
	const [actionLoading, setActionLoading] = useState(false)

	const fetchUsers = useCallback(() => {
		getUsers()
			.then((res) => setUsers(res?.data ?? []))
			.catch(() => setUsers([]))
	}, [])

	useEffect(() => {
		fetchUsers()
	}, [fetchUsers])

	const filtered = (users ?? []).filter((u) => {
		const q = search.toLowerCase()
		return (
			u.phone?.includes(q) ||
			u.firstName?.toLowerCase().includes(q) ||
			u.lastName?.toLowerCase().includes(q)
		)
	})

	const toggleAuditLog = async (userID: number) => {
		if (expandedID === userID) {
			setExpandedID(null)
			return
		}
		setExpandedID(userID)
		if (!auditLogs[userID]) {
			setAuditLoading(userID)
			try {
				const res = await getUserAuditLogs(userID)
				setAuditLogs((prev) => ({ ...prev, [userID]: res?.data ?? [] }))
			} catch {
				setAuditLogs((prev) => ({ ...prev, [userID]: [] }))
			} finally {
				setAuditLoading(null)
			}
		}
	}

	const handleBan = async (user: UserItem) => {
		setActionLoading(true)
		try {
			await banUser(user.id)
			setUsers((prev) => prev?.map((u) => u.id === user.id ? { ...u, status: "لیست سیاه" } : u) ?? prev)
			CustomToast("کاربر مسدود شد", "success")
		} finally {
			setActionLoading(false)
		}
	}

	const handleUnban = async (user: UserItem) => {
		setActionLoading(true)
		try {
			await unbanUser(user.id)
			setUsers((prev) => prev?.map((u) => u.id === user.id ? { ...u, status: "فعال" } : u) ?? prev)
			CustomToast("رفع مسدودیت شد", "success")
		} finally {
			setActionLoading(false)
		}
	}

	const handleChangeRole = async () => {
		if (!roleDialog.user || !newType || !reason) return
		setActionLoading(true)
		try {
			await changeUserType(roleDialog.user.id, { type: newType, reason })
			setUsers((prev) =>
				prev?.map((u) => u.id === roleDialog.user!.id ? { ...u, type: newType } : u) ?? prev
			)
			setAuditLogs((prev) => {
				const copy = { ...prev }
				delete copy[roleDialog.user!.id]
				return copy
			})
			CustomToast("نقش کاربر تغییر کرد", "success")
			setRoleDialog({ open: false, user: null })
			setNewType("")
			setReason("")
		} finally {
			setActionLoading(false)
		}
	}

	return (
		<main className="p-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">مدیریت کاربران</h1>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">
						مجموع:{" "}
						<span className="font-bold text-foreground">{users?.length ?? "—"}</span>
					</span>
				</div>
			</div>

			<div className="flex items-center justify-between mb-6 flex-wrap gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
					<InputFree
						label="جستجو (نام یا شماره)..."
						value={search}
						onValueChange={setSearch}
						inputClassName="pr-10"
					/>
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>نام</TableHead>
								<TableHead>شماره تماس</TableHead>
								<TableHead>نوع حساب</TableHead>
								<TableHead>وضعیت</TableHead>
								<TableHead className="text-center">عملیات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users === null && (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
										در حال بارگذاری...
									</TableCell>
								</TableRow>
							)}
							{users?.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-12">
										<div className="flex flex-col items-center gap-2 text-muted-foreground">
											<Users className="w-10 h-10" />
											<span>کاربری یافت نشد</span>
										</div>
									</TableCell>
								</TableRow>
							)}
							{filtered.map((user, i) => {
								const isBanned = user.status === "لیست سیاه"
								const isExpanded = expandedID === user.id
								const logs = auditLogs[user.id] ?? []
								const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "بدون نام"

								return (
									<>
										<motion.tr
											key={user.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: i * 0.04 }}
											className="group hover:bg-muted/50 border-b"
										>
											<TableCell className="font-medium">{fullName}</TableCell>
											<TableCell className="text-sm text-muted-foreground" dir="ltr">
												{user.phone}
											</TableCell>
											<TableCell>
												<Badge variant="secondary" className="text-xs">
													{TYPE_LABELS[user.type] ?? user.type}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge variant={isBanned ? "destructive" : "available"} className="text-xs">
													{isBanned ? "مسدود" : "فعال"}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<Button
														variant="outline"
														size="sm"
														onClick={() => {
															setRoleDialog({ open: true, user })
															setNewType(user.type)
															setReason("")
														}}
														className="text-xs gap-1"
													>
														<ShieldCheck className="w-3 h-3" />
														تغییر نقش
													</Button>

													{isBanned ? (
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleUnban(user)}
															disabled={actionLoading}
															className="text-xs gap-1 border-green-500 text-green-600 hover:bg-green-50"
														>
															<CheckCircle2 className="w-3 h-3" />
															رفع مسدودیت
														</Button>
													) : (
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleBan(user)}
															disabled={actionLoading}
															className="text-xs gap-1 border-destructive text-destructive hover:bg-destructive/10"
														>
															<Ban className="w-3 h-3" />
															مسدود
														</Button>
													)}

													<Button
														variant="ghost"
														size="sm"
														onClick={() => toggleAuditLog(user.id)}
														className="text-xs gap-1"
													>
														{isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
														سابقه
													</Button>
												</div>
											</TableCell>
										</motion.tr>

										{isExpanded && (
											<motion.tr
												key={`audit-${user.id}`}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
											>
												<TableCell colSpan={5} className="bg-muted/20 px-6 py-4">
													<p className="text-sm font-medium mb-3">سابقه تغییر نقش</p>
													{auditLoading === user.id ? (
														<p className="text-xs text-muted-foreground">در حال بارگذاری...</p>
													) : logs.length === 0 ? (
														<p className="text-xs text-muted-foreground">سابقه‌ای ثبت نشده</p>
													) : (
														<div className="space-y-2">
															{logs.map((log) => (
																<div key={log.id} className="text-xs bg-background rounded p-2 border">
																	<span className="text-muted-foreground">
																		{new Date(log.changedAt).toLocaleDateString("fa-IR")}
																	</span>
																	{" — "}
																	<span>{TYPE_LABELS[log.oldType] ?? log.oldType}</span>
																	{" → "}
																	<span className="font-medium">{TYPE_LABELS[log.newType] ?? log.newType}</span>
																	{log.reason && (
																		<span className="text-muted-foreground"> ({log.reason})</span>
																	)}
																</div>
															))}
														</div>
													)}
												</TableCell>
											</motion.tr>
										)}
									</>
								)
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog open={roleDialog.open} onOpenChange={(open) => setRoleDialog({ open, user: open ? roleDialog.user : null })}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>تغییر نقش کاربر</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<p className="text-sm text-muted-foreground">
							{roleDialog.user?.firstName} {roleDialog.user?.lastName} — {roleDialog.user?.phone}
						</p>
						<div className="space-y-1">
							<label className="text-sm font-medium">نقش جدید</label>
							<Select value={newType} onValueChange={setNewType}>
								<SelectTrigger>
									<SelectValue placeholder="انتخاب نقش" />
								</SelectTrigger>
								<SelectContent>
									{TYPE_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1">
							<label className="text-sm font-medium">دلیل تغییر</label>
							<Textarea
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder="دلیل تغییر نقش را بنویسید..."
								className="resize-none"
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setRoleDialog({ open: false, user: null })}>
							انصراف
						</Button>
						<Button
							onClick={handleChangeRole}
							disabled={actionLoading || !newType || !reason}
						>
							تایید
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	)
}

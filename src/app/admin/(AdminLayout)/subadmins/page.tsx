"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, ShieldCheck } from "lucide-react"
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
import InputFree from "@/components/Custom/Input/InputFree"
import PermissionGuard from "@/components/admin/PermissionGuard"
import CreateSubAdminDialog from "@/components/admin/SubAdmin/CreateSubAdminDialog"
import AssignRoleDialog from "@/components/admin/SubAdmin/AssignRoleDialog"
import RevokeSubAdminDialog from "@/components/admin/SubAdmin/RevokeSubAdminDialog"
import { getSubAdmins } from "@/services/userService"
import { Skeleton } from "@/components/ui/skeleton"
import { getRoles } from "@/services/roleService"

interface SubAdmin {
	id: number
	firstName: string
	lastName: string
	phone: string
	email: string
	roleID: number | null
	roleName: string
}

interface Role {
	id: number
	name: string
}

function SubAdminsPageContent() {
	const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([])
	const [roles, setRoles] = useState<Role[]>([])
	const [search, setSearch] = useState("")
	const [loading, setLoading] = useState(true)

	const filtered = subAdmins.filter((u) => {
		const q = search.toLowerCase()
		return (
			u.phone?.includes(q) ||
			u.firstName?.toLowerCase().includes(q) ||
			u.lastName?.toLowerCase().includes(q)
		)
	})

	const fetchAll = useCallback(() => {
		setLoading(true)
		Promise.all([getSubAdmins(), getRoles()]).then(([subRes, rolesRes]) => {
			setSubAdmins(subRes?.data ?? [])
			setRoles(rolesRes?.data ?? [])
		}).finally(() => setLoading(false))
	}, [])

	useEffect(() => {
		fetchAll()
	}, [fetchAll])

	return (
		<main className="p-4 sm:p-6">
			<div className="mb-6">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">مدیریت زیرمدیران</h1>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">
						مجموع:{" "}
						<span className="font-bold text-foreground">{subAdmins.length}</span>
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
				<CreateSubAdminDialog roles={roles} onDone={fetchAll} />
			</div>

			{/* Mobile Cards */}
			<div className="sm:hidden space-y-3">
				{loading && Array.from({ length: 5 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-4 space-y-3">
							<div className="flex justify-between">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-5 w-20 rounded-full" />
							</div>
							<Skeleton className="h-3 w-28" />
							<div className="flex justify-end gap-2">
								<Skeleton className="h-8 w-20 rounded-md" />
								<Skeleton className="h-8 w-20 rounded-md" />
							</div>
						</CardContent>
					</Card>
				))}
				{!loading && filtered.length === 0 && (
					<div className="flex flex-col items-center gap-2 text-muted-foreground py-12">
						<ShieldCheck className="w-10 h-10" />
						<span>زیرمدیری یافت نشد</span>
					</div>
				)}
				{!loading && filtered.map((user, i) => {
					const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "بدون نام"
					return (
						<motion.div key={user.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
							<Card>
								<CardContent className="p-4">
									<div className="flex items-start justify-between gap-2 mb-2">
										<p className="font-medium">{fullName}</p>
										{user.roleName
											? <Badge variant="secondary" className="text-xs shrink-0">{user.roleName}</Badge>
											: <span className="text-xs text-muted-foreground">بدون نقش</span>}
									</div>
									<p className="text-sm text-muted-foreground mb-1" dir="ltr">{user.phone}</p>
									<p className="text-sm text-muted-foreground mb-3">{user.email || "—"}</p>
									<div className="flex justify-end gap-2">
										<AssignRoleDialog userID={user.id} currentRoleID={user.roleID} roles={roles} onDone={fetchAll} />
										<RevokeSubAdminDialog userID={user.id} name={fullName} onDone={fetchAll} />
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)
				})}
			</div>

			{/* Desktop Table */}
			<Card className="hidden sm:block">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>نام</TableHead>
								<TableHead>شماره تماس</TableHead>
								<TableHead>ایمیل</TableHead>
								<TableHead>نقش</TableHead>
								<TableHead className="text-center">عملیات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading && Array.from({ length: 6 }).map((_, i) => (
								<TableRow key={i}>
									<TableCell><Skeleton className="h-4 w-28" /></TableCell>
									<TableCell><Skeleton className="h-4 w-28" /></TableCell>
									<TableCell><Skeleton className="h-4 w-36" /></TableCell>
									<TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
									<TableCell>
										<div className="flex items-center justify-center gap-2">
											<Skeleton className="h-8 w-20 rounded-md" />
											<Skeleton className="h-8 w-20 rounded-md" />
										</div>
									</TableCell>
								</TableRow>
							))}
							{!loading && filtered.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-12">
										<div className="flex flex-col items-center gap-2 text-muted-foreground">
											<ShieldCheck className="w-10 h-10" />
											<span>زیرمدیری یافت نشد</span>
										</div>
									</TableCell>
								</TableRow>
							)}
							{!loading && filtered.map((user, i) => {
								const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "بدون نام"
								return (
									<motion.tr key={user.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="group hover:bg-muted/50 border-b">
										<TableCell className="font-medium">{fullName}</TableCell>
										<TableCell className="text-sm text-muted-foreground" dir="ltr">{user.phone}</TableCell>
										<TableCell className="text-sm text-muted-foreground">{user.email || "—"}</TableCell>
										<TableCell>
											{user.roleName
												? <Badge variant="secondary" className="text-xs">{user.roleName}</Badge>
												: <span className="text-xs text-muted-foreground">بدون نقش</span>}
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center gap-2">
												<AssignRoleDialog userID={user.id} currentRoleID={user.roleID} roles={roles} onDone={fetchAll} />
												<RevokeSubAdminDialog userID={user.id} name={fullName} onDone={fetchAll} />
											</div>
										</TableCell>
									</motion.tr>
								)
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</main>
	)
}

export default function SubAdminsPage() {
	return (
		<PermissionGuard permission="rbac:see">
			<SubAdminsPageContent />
		</PermissionGuard>
	)
}

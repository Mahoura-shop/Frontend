"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import InputFree from "@/components/Custom/Input/InputFree"
import CreateUpdateRoleDialog from "@/components/admin/Role/CreateUpdateRoleDialog"
import DeleteRoleDialog from "@/components/admin/Role/DeleteRoleDialog"
import { getRoles, getPermissions } from "@/services/roleService"
import { Skeleton } from "@/components/ui/skeleton"
import PermissionGuard from "@/components/admin/PermissionGuard"
import { usePermission } from "@/hooks/usePermission"

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

function RolesPageContent() {
	const canCreate = usePermission("rbac:create");
	const canEdit = usePermission("rbac:edit");
	const canDelete = usePermission("rbac:delete");
	const [roles, setRoles] = useState<Role[]>([])
	const [permissions, setPermissions] = useState<Permission[]>([])
	const [search, setSearch] = useState("")
	const [loading, setLoading] = useState(true)

	const filtered = roles.filter((r) =>
		r.name.toLowerCase().includes(search.toLowerCase())
	)

	const fetchAll = useCallback(() => {
		setLoading(true)
		Promise.all([getRoles(), getPermissions()]).then(([rolesRes, permsRes]) => {
			setRoles(rolesRes?.data ?? [])
			setPermissions(permsRes?.data ?? [])
		}).finally(() => setLoading(false))
	}, [])

	useEffect(() => {
		fetchAll()
	}, [fetchAll])

	return (
		<main className="p-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">مدیریت نقش‌ها</h1>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">
						مجموع:{" "}
						<span className="font-bold text-foreground">{roles.length}</span>
					</span>
				</div>
			</div>

			<div className="flex items-center justify-between mb-6 flex-wrap gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
					<InputFree
						label="جستجوی نقش..."
						value={search}
						onValueChange={setSearch}
						inputClassName="pr-10"
					/>
				</div>
				{canCreate && <CreateUpdateRoleDialog mode="create" permissions={permissions} onDone={fetchAll} />}
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>نام نقش</TableHead>
								<TableHead>توضیحات</TableHead>
								<TableHead>دسترسی‌ها</TableHead>
								<TableHead className="text-center">عملیات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading && (
								Array.from({ length: 6 }).map((_, i) => (
									<TableRow key={i}>
										<TableCell><Skeleton className="h-4 w-24" /></TableCell>
										<TableCell><Skeleton className="h-4 w-40" /></TableCell>
										<TableCell>
											<div className="flex gap-1 flex-wrap">
												<Skeleton className="h-5 w-16 rounded-full" />
												<Skeleton className="h-5 w-20 rounded-full" />
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center gap-2">
												<Skeleton className="h-8 w-8 rounded-md" />
												<Skeleton className="h-8 w-8 rounded-md" />
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						{!loading && filtered.length === 0 && (
								<TableRow>
									<TableCell colSpan={4} className="text-center">
										<div className="flex justify-center items-center text-2xl w-full min-h-[50vh]">
											هیچ نقشی یافت نشد.
										</div>
									</TableCell>
								</TableRow>
							)}
							{!loading && filtered.map((role, i) => (
								<motion.tr
									key={role.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.05 }}
									className="group hover:bg-muted/50"
								>
									<TableCell className="font-medium">{role.name}</TableCell>
									<TableCell className="text-muted-foreground text-sm">
										{role.description || "—"}
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{role.permissions.length === 0 ? (
												<span className="text-xs text-muted-foreground">بدون دسترسی</span>
											) : (
												role.permissions.map((p) => (
													<Badge key={p.id} variant="secondary" className="text-xs">
														{p.name}
													</Badge>
												))
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											{canEdit && (
												<CreateUpdateRoleDialog
													mode="update"
													role={role}
													permissions={permissions}
													onDone={fetchAll}
												/>
											)}
											{canDelete && (
												<DeleteRoleDialog
													id={role.id}
													name={role.name}
													onDone={fetchAll}
												/>
											)}
										</div>
									</TableCell>
								</motion.tr>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</main>
	)
}

export default function RolesPage() {
	return (
		<PermissionGuard permission="rbac:see">
			<RolesPageContent />
		</PermissionGuard>
	)
}

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { getAdminLogs } from "@/services/adminLogService"
import PermissionGuard from "@/components/admin/PermissionGuard"

interface AdminActivityLog {
	id: number
	adminID: number
	adminPhone: string
	adminName: string
	method: string
	path: string
	ipAddress: string
	statusCode: number
	createdAt: string
}

const methodColors: Record<string, string> = {
	POST: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	PUT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
	PATCH: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
	DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

function AdminLogsPageContent() {
	const [logs, setLogs] = useState<AdminActivityLog[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")

	useEffect(() => {
		getAdminLogs()
			.then((res) => setLogs(res?.data ?? []))
			.catch(() => {})
			.finally(() => setLoading(false))
	}, [])

	const filtered = search
		? logs.filter(
				(l) =>
					l.adminPhone?.includes(search) ||
					l.adminName?.toLowerCase().includes(search.toLowerCase()) ||
					l.path?.toLowerCase().includes(search.toLowerCase()),
			)
		: logs

	return (
		<main className="p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">لاگ‌های ادمین</h1>
				<p className="text-muted-foreground">تمام فعالیت‌های مدیران سیستم</p>
			</div>

			<div className="flex items-center gap-3 mb-6">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="جستجو در شماره، نام یا مسیر..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pr-9"
					/>
				</div>
				<span className="text-sm text-muted-foreground">
					{filtered.length} رکورد
				</span>
			</div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
				<Card>
					<CardContent className="p-0">
						{loading ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ادمین</TableHead>
										<TableHead>متد</TableHead>
										<TableHead>مسیر</TableHead>
										<TableHead>IP</TableHead>
										<TableHead>وضعیت</TableHead>
										<TableHead>زمان</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{Array.from({ length: 8 }).map((_, i) => (
										<TableRow key={i}>
											<TableCell><Skeleton className="h-4 w-28" /></TableCell>
											<TableCell><Skeleton className="h-4 w-14" /></TableCell>
											<TableCell><Skeleton className="h-4 w-48" /></TableCell>
											<TableCell><Skeleton className="h-4 w-24" /></TableCell>
											<TableCell><Skeleton className="h-4 w-10" /></TableCell>
											<TableCell><Skeleton className="h-4 w-32" /></TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : filtered.length === 0 ? (
							<div className="p-8 text-center text-muted-foreground">
								هیچ لاگی یافت نشد
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ادمین</TableHead>
										<TableHead>متد</TableHead>
										<TableHead>مسیر</TableHead>
										<TableHead>IP</TableHead>
										<TableHead>وضعیت</TableHead>
										<TableHead>زمان</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filtered.map((log, i) => (
										<motion.tr
											key={log.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: i * 0.03 }}
											className="group hover:bg-muted/50"
										>
											<TableCell>
												<div className="text-sm font-medium">{log.adminPhone}</div>
												{log.adminName.trim() && (
													<div className="text-xs text-muted-foreground">{log.adminName}</div>
												)}
											</TableCell>
											<TableCell>
												<span
													className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold ${methodColors[log.method] ?? "bg-muted text-muted-foreground"}`}
												>
													{log.method}
												</span>
											</TableCell>
											<TableCell className="font-mono text-xs text-muted-foreground max-w-xs truncate">
												{log.path}
											</TableCell>
											<TableCell className="text-xs text-muted-foreground">
												{log.ipAddress}
											</TableCell>
											<TableCell>
												<Badge
													variant={log.statusCode >= 400 ? "destructive" : "secondary"}
													className="text-xs"
												>
													{log.statusCode}
												</Badge>
											</TableCell>
											<TableCell className="text-xs text-muted-foreground whitespace-nowrap">
												{new Date(log.createdAt).toLocaleString("fa-IR")}
											</TableCell>
										</motion.tr>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</motion.div>
		</main>
	)
}

export default function AdminLogsPage() {
	return (
		<PermissionGuard permission="adminlogs:see">
			<AdminLogsPageContent />
		</PermissionGuard>
	)
}

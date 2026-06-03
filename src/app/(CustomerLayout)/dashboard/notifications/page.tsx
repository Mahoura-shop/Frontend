"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Bell, Truck, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { notificationService } from "@/services/notificationService"
import { useNotificationStore } from "@/store/useNotificationStore"
import type { Notification } from "@/types/Notification"
import { formatDate } from "@/utils/formatDate"

function notifIcon(type: number) {
	return type === 2 ? Package : Truck
}

function notifColors(type: number) {
	return type === 2
		? { bg: "from-green-500/20 to-green-600/20", icon: "text-green-600" }
		: { bg: "from-blue-500/20 to-blue-600/20", icon: "text-blue-600" }
}

export default function NotificationsPage() {
	const [allNotifications, setAllNotifications] = useState<Notification[]>([])
	const [loading, setLoading] = useState(true)
	const { markAsRead, markAllAsRead } = useNotificationStore()

	useEffect(() => {
		notificationService.getAll()
			.then(setAllNotifications)
			.finally(() => setLoading(false))
	}, [])

	const handleMarkOne = async (id: number) => {
		setAllNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
		)
		await markAsRead(id)
	}

	const handleMarkAll = async () => {
		setAllNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
		await markAllAsRead()
	}

	const unreadCount = allNotifications.filter((n) => !n.isRead).length

	return (
		<div className="space-y-4">
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center justify-between"
			>
				<div>
					<h1 className="text-2xl font-bold gradient-text mb-1 flex items-center gap-3">
						اعلان‌ها
						{unreadCount > 0 && (
							<Badge variant="destructive" className="text-xs">
								{new Intl.NumberFormat("fa-IR").format(unreadCount)} جدید
							</Badge>
						)}
					</h1>
					<p className="text-sm text-muted-foreground">
						{new Intl.NumberFormat("fa-IR").format(allNotifications.length)} اعلان
					</p>
				</div>
				{unreadCount > 0 && (
					<Button variant="outline" size="sm" onClick={handleMarkAll} data-testid="mark-all-read">
						همه را خوانده‌شده علامت بزن
					</Button>
				)}
			</motion.div>

			{loading && (
				<div className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="p-4">
								<div className="flex gap-4 items-start">
									<Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-40" />
										<Skeleton className="h-3 w-56" />
										<Skeleton className="h-3 w-24" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{!loading && allNotifications.length === 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3"
				>
					<Bell className="w-12 h-12 opacity-30" />
					<p>اعلانی وجود ندارد</p>
				</motion.div>
			)}

			{!loading && (
				<div className="space-y-3">
					{allNotifications.map((notif, index) => {
						const Icon = notifIcon(notif.type)
						const colors = notifColors(notif.type)
						return (
							<motion.div
								key={notif.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.04 }}
								onClick={() => !notif.isRead && handleMarkOne(notif.id)}
								className={!notif.isRead ? "cursor-pointer" : ""}
							>
								<Card className={`transition-shadow hover:shadow-md ${!notif.isRead ? "border-primary-rose/40" : ""}`} data-testid={`notification-${notif.id}`}>
									<CardContent className="p-4">
										<div className="flex gap-4 items-start">
											<div className={`w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
												<Icon className={`w-5 h-5 ${colors.icon}`} />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<p className="font-semibold text-sm">{notif.title}</p>
													{!notif.isRead && (
														<span className="w-2 h-2 rounded-full bg-primary-rose flex-shrink-0" />
													)}
												</div>
												<p className="text-sm text-muted-foreground mb-1">{notif.body}</p>
												<p className="text-xs text-muted-foreground">{formatDate(notif.createdAt)}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						)
					})}
				</div>
			)}
		</div>
	)
}

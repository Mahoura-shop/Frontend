"use client"

import { motion } from "framer-motion"
import { Bell, ShoppingBag, Truck, Wallet, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MOCK_NOTIFICATIONS = [
	{
		id: 1,
		icon: Truck,
		color: "from-blue-500/20 to-blue-600/20",
		iconColor: "text-blue-600",
		title: "سفارش شما ارسال شد",
		body: "سفارش #۱۲۳۴ تحویل پست داده شد",
		date: "۱۴۰۳/۰۲/۲۵",
		read: false,
	},
	{
		id: 2,
		icon: ShoppingBag,
		color: "from-green-500/20 to-green-600/20",
		iconColor: "text-green-600",
		title: "سفارش تایید شد",
		body: "پرداخت سفارش #۱۲۳۳ با موفقیت انجام شد",
		date: "۱۴۰۳/۰۲/۲۴",
		read: true,
	},
	{
		id: 3,
		icon: Wallet,
		color: "from-primary-rose/20 to-accent-gold/20",
		iconColor: "text-primary-rose",
		title: "شارژ کیف پول",
		body: "مبلغ ۵۰۰,۰۰۰ ریال به کیف پول شما اضافه شد",
		date: "۱۴۰۳/۰۲/۲۳",
		read: true,
	},
	{
		id: 4,
		icon: Tag,
		color: "from-purple-500/20 to-purple-600/20",
		iconColor: "text-purple-600",
		title: "تخفیف ویژه",
		body: "محصولات دسته آرایشی تا ۳۰٪ تخفیف دارند",
		date: "۱۴۰۳/۰۲/۲۰",
		read: true,
	},
]

export default function NotificationsPage() {
	const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

	return (
		<div className="space-y-4">
			<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
				<h1 className="text-2xl font-bold gradient-text mb-1 flex items-center gap-3">
					اعلان‌ها
					{unreadCount > 0 && (
						<Badge variant="destructive" className="text-xs">
							{new Intl.NumberFormat("fa-IR").format(unreadCount)} جدید
						</Badge>
					)}
				</h1>
				<p className="text-sm text-muted-foreground">{new Intl.NumberFormat("fa-IR").format(MOCK_NOTIFICATIONS.length)} اعلان</p>
			</motion.div>

			<div className="space-y-3">
				{MOCK_NOTIFICATIONS.map((notif, index) => {
					const Icon = notif.icon
					return (
						<motion.div
							key={notif.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.07 }}
						>
							<Card className={`transition-shadow hover:shadow-md ${!notif.read ? "border-primary-rose/40" : ""}`}>
								<CardContent className="p-4">
									<div className="flex gap-4 items-start">
										<div className={`w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br ${notif.color} flex items-center justify-center`}>
											<Icon className={`w-5 h-5 ${notif.iconColor}`} />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<p className="font-semibold text-sm">{notif.title}</p>
												{!notif.read && (
													<span className="w-2 h-2 rounded-full bg-primary-rose flex-shrink-0" />
												)}
											</div>
											<p className="text-sm text-muted-foreground mb-1">{notif.body}</p>
											<p className="text-xs text-muted-foreground">{notif.date}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

import { create } from "zustand"
import { notificationService } from "@/services/notificationService"
import type { Notification } from "@/types/Notification"
import CustomToast from "@/components/Custom/CustomToast/CustomToast"

interface NotificationStore {
	unreadCount: number
	recentNotifications: Notification[]
	initialized: boolean
	initialize: () => Promise<void>
	addNotification: (n: Notification) => void
	markAsRead: (id: number) => Promise<void>
	markAllAsRead: () => Promise<void>
	reset: () => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
	unreadCount: 0,
	recentNotifications: [],
	initialized: false,

	initialize: async () => {
		if (get().initialized) return
		try {
			const [count, all] = await Promise.all([
				notificationService.getUnreadCount(),
				notificationService.getAll(),
			])
			set({ unreadCount: count, recentNotifications: all.slice(0, 10), initialized: true })
		} catch {}
	},

	addNotification: (n: Notification) => {
		set((state) => ({
			unreadCount: state.unreadCount + 1,
			recentNotifications: [n, ...state.recentNotifications].slice(0, 10),
		}))
		CustomToast(n.title + " — " + n.body, "info")
	},

	markAsRead: async (id: number) => {
		const notif = get().recentNotifications.find((n) => n.id === id)
		const wasUnread = notif && !notif.isRead
		set((state) => ({
			recentNotifications: state.recentNotifications.map((n) =>
				n.id === id ? { ...n, isRead: true } : n
			),
			unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
		}))
		try {
			await notificationService.markAsRead(id)
		} catch {}
	},

	markAllAsRead: async () => {
		set((state) => ({
			recentNotifications: state.recentNotifications.map((n) => ({ ...n, isRead: true })),
			unreadCount: 0,
		}))
		try {
			await notificationService.markAllAsRead()
		} catch {}
	},

	reset: () => set({ unreadCount: 0, recentNotifications: [], initialized: false }),
}))

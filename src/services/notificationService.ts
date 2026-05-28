import { getData, patchData, baseURL } from "./services"
import type { Notification, UnreadCountResponse } from "@/types/Notification"

export const notificationService = {
	getAll: async (): Promise<Notification[]> => {
		const res = await getData({ endPoint: "v1/notifications" })
		return res.data ?? []
	},

	getUnreadCount: async (): Promise<number> => {
		const res = await getData({ endPoint: "v1/notifications/unread-count" })
		return (res.data as UnreadCountResponse)?.count ?? 0
	},

	markAsRead: async (id: number): Promise<void> => {
		await patchData({ endPoint: `v1/notifications/${id}/read`, data: {} })
	},

	markAllAsRead: async (): Promise<void> => {
		await patchData({ endPoint: "v1/notifications/read-all", data: {} })
	},

	createSSEConnection: (token: string, onEvent: (n: Notification) => void): EventSource => {
		const url = `${baseURL}v1/notifications/stream?token=${encodeURIComponent(token)}`
		const es = new EventSource(url)
		es.onmessage = (e) => {
			try {
				const notification = JSON.parse(e.data) as Notification
				onEvent(notification)
			} catch {}
		}
		return es
	},
}

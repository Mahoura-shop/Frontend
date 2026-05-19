export type Notification = {
	id: number
	type: number // 1 = order status, 2 = back in stock
	title: string
	body: string
	isRead: boolean
	refID?: number
	createdAt: string
}

export type UnreadCountResponse = {
	count: number
}

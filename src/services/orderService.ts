import { getData, postData } from "./services"

export const createOrder = (data: {
	paymentMethod: number
	addressID?: number
	instalmentCount?: number
	instalmentIntervalDays?: number
}) => postData({ endPoint: "v1/order", data })

export const payByWallet = (orderID: number) =>
	postData({ endPoint: `v1/order/${orderID}/pay/wallet`, data: {} })

export const initiatePayment = (orderID: number) =>
	postData({ endPoint: `v1/order/${orderID}/pay/gateway`, data: {} })

export const getMyOrders = () => getData({ endPoint: "v1/order" })

export const getOrderDetail = (orderID: number) =>
	getData({ endPoint: `v1/order/${orderID}` })

export const getOrderInstalments = (orderID: number) =>
	getData({ endPoint: `v1/order/${orderID}/instalments` })

export const getAllOrders = (status?: string) => {
	const endpoint = status ? `v1/admin/orders?status=${status}` : "v1/admin/orders"
	return getData({ endPoint: endpoint })
}

export const getAdminOrderDetail = (orderID: number) =>
	getData({ endPoint: `v1/admin/orders/${orderID}` })

export const updateOrderStatus = (orderID: number, data: { status: number; note: string }) =>
	postData({ endPoint: `v1/admin/orders/${orderID}/status`, data })

export const cancelOrder = (orderID: number) =>
	postData({ endPoint: `v1/admin/orders/${orderID}/cancel`, data: {} })

export const flagOrderRefund = (orderID: number) =>
	postData({ endPoint: `v1/admin/orders/${orderID}/refund-flag`, data: {} })

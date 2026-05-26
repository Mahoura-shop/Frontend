import { getData, patchData, postData } from "./services"

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

export const verifyPayment = (authority: string, status: string) =>
	getData({ endPoint: `v1/order/pay/verify`, params: { Authority: authority, Status: status } })

export const getMyOrders = () => getData({ endPoint: "v1/order" })

export const getOrderDetail = (orderID: number) =>
	getData({ endPoint: `v1/order/${orderID}` })

export const getOrderInstalments = (orderID: number) =>
	getData({ endPoint: `v1/order/${orderID}/instalments` })

export const getAllOrders = (status?: string) => {
	const endpoint = status ? `v1/orders?status=${status}` : "v1/orders"
	return getData({ endPoint: endpoint })
}

export const getAdminOrderDetail = (orderID: number) =>
	getData({ endPoint: `v1/orders/${orderID}` })

export const updateOrderStatus = (orderID: number, data: { status: number; note: string; trackingCode?: string }) =>
	patchData({ endPoint: `v1/orders/${orderID}/status`, data })

export const cancelOrder = (orderID: number, reason: string) =>
	postData({ endPoint: `v1/orders/${orderID}/cancel`, data: { reason } })

export const flagOrderRefund = (orderID: number) =>
	postData({ endPoint: `v1/orders/${orderID}/refund-flag`, data: {} })

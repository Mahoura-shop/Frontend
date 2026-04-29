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

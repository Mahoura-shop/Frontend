import { getData, postData } from "./services"

export const getWalletBalance = () => getData({ endPoint: "v1/wallet" })

export const getWalletHistory = () => getData({ endPoint: "v1/wallet/history" })

export const depositWallet = (amount: number) =>
	postData({ endPoint: "v1/wallet/deposit", data: { amount } })

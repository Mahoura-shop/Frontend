import { getData, postData } from "./services"

export const getWalletBalance = () => getData({ endPoint: "v1/wallet" })

export const depositWallet = (amount: number) =>
	postData({ endPoint: "v1/wallet/deposit", data: { amount } })

export const withdrawWallet = (amount: number) =>
	postData({ endPoint: "v1/wallet/withdraw", data: { amount } })

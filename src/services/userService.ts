import { getData, patchData } from "./services"

export const getUsers = () => getData({ endPoint: "v1/users" })

export const changeUserType = (userID: number, data: { type: string; reason: string }) =>
	patchData({ endPoint: `v1/users/${userID}/type`, data })

export const getUserAuditLogs = (userID: number) =>
	getData({ endPoint: `v1/users/${userID}/audit-logs` })

export const banUser = (userID: number) =>
	patchData({ endPoint: `v1/users/${userID}/ban`, data: {} })

export const unbanUser = (userID: number) =>
	patchData({ endPoint: `v1/users/${userID}/unban`, data: {} })

export const getAdminUserWallet = (userID: number) =>
	getData({ endPoint: `v1/users/${userID}/wallet` })

export const getMyProfile = () => getData({ endPoint: "v1/profile" })

export const updateMyProfile = (data: { firstName: string; lastName: string; email: string }) =>
	patchData({ endPoint: "v1/profile", data })

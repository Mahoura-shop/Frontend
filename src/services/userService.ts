import { getData, patchData, postData, deleteData } from "./services"

export const getUsers = () => getData({ endPoint: "v1/users" })

export const changeUserType = (userID: number, newType: number) =>
	patchData({ endPoint: `v1/users/${userID}/type`, data: { newType } })

export const getUserAuditLogs = (userID: number) =>
	getData({ endPoint: `v1/users/${userID}/audit-logs` })

export const banUser = (userID: number) =>
	patchData({ endPoint: `v1/users/${userID}/ban`, data: {} })

export const unbanUser = (userID: number) =>
	patchData({ endPoint: `v1/users/${userID}/unban`, data: {} })

export const getAdminUserWallet = (userID: number) =>
	getData({ endPoint: `v1/users/${userID}/wallet` })

export const getMyProfile = () => getData({ endPoint: "v1/profile" })

export const updateMyProfile = (data: { firstName: string; lastName: string }) =>
	patchData({ endPoint: "v1/profile", data })

export const getSubAdmins = () =>
	getData({ endPoint: "v1/subadmins" })

export const createSubAdmin = (phone: string, roleID: number) =>
	postData({ endPoint: "v1/subadmins", data: { phone, roleID } })

export const assignSubAdminRole = (userID: number, roleID: number) =>
	patchData({ endPoint: `v1/subadmins/${userID}/role`, data: { roleID } })

export const revokeSubAdmin = (userID: number) =>
	deleteData({ endPoint: `v1/subadmins/${userID}`, data: {} })

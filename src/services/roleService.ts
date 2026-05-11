import { getData, postData, putData, deleteData } from "./services"

export const getRoles = () => getData({ endPoint: "v1/roles" })

export const getPermissions = () => getData({ endPoint: "v1/roles/permissions" })

export const createRole = (data: { name: string; description: string; permissionIDs: number[] }) =>
	postData({ endPoint: "v1/roles", data })

export const updateRole = (roleID: number, data: { name: string; description: string; permissionIDs: number[] }) =>
	putData({ endPoint: `v1/roles/${roleID}`, data })

export const deleteRole = (roleID: number) =>
	deleteData({ endPoint: `v1/roles/${roleID}` })

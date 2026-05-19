import { getData } from "./services"

export const getAdminLogs = () => getData({ endPoint: "v1/admin/logs" })

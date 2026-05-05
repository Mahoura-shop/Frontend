import { getData, postData, patchData } from "./services"

export interface UpgradeRequest {
  id: number
  userID: number
  userPhone: string
  requestedType: number
  businessName: string
  taxID: string
  status: number
  statusLabel: string
  adminNote: string
  reviewedByID?: number
  createdAt: string
}

export interface UserAuditLog {
  id: number
  userID: number
  changedByID: number
  oldType: string
  newType: string
  reason: string
  createdAt: string
}

export const upgradeRequestService = {
  async submitUpgradeRequest(
    requestedType: number,
    businessName: string,
    taxID: string,
  ): Promise<void> {
    return postData({
      endPoint: "v1/upgrade-requests",
      data: {
        requestedType,
        businessName,
        taxID,
      },
    })
  },

  async getMyUpgradeRequests(): Promise<UpgradeRequest[]> {
    const response = await getData({ endPoint: "v1/upgrade-requests" })
    return response.data || []
  },

  async getAllUpgradeRequests(status?: string): Promise<UpgradeRequest[]> {
    const params = status ? { status } : {}
    const response = await getData({ endPoint: "v1/upgrade-requests", params })
    return response.data || []
  },

  async getUpgradeRequest(requestID: number): Promise<UpgradeRequest> {
    const response = await getData({ endPoint: `v1/upgrade-requests/${requestID}` })
    return response.data
  },

  async reviewUpgradeRequest(
    requestID: number,
    action: "approve" | "reject" | "info",
    adminNote?: string,
  ): Promise<void> {
    return patchData({
      endPoint: `v1/upgrade-requests/${requestID}/review`,
      data: {
        action,
        adminNote,
      },
    })
  },

  async changeUserType(
    userID: number,
    newType: number,
    reason: string,
  ): Promise<void> {
    return patchData({
      endPoint: `v1/users/${userID}/type`,
      data: {
        newType,
        reason,
      },
    })
  },

  async getUserAuditLogs(userID: number): Promise<UserAuditLog[]> {
    const response = await getData({ endPoint: `v1/users/${userID}/audit-logs` })
    return response.data || []
  },
}

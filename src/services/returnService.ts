import { getData, postData, patchData } from "./services";

export const requestReturn = (data: { orderItemID: number; reason: string; quantity: number }) =>
	postData({ endPoint: "v1/returns", data });

export const getMyReturns = () => getData({ endPoint: "v1/returns" });

export const getAdminReturns = (status?: string) =>
	getData({ endPoint: status ? `v1/returns?status=${status}` : "v1/returns" });

export const reviewReturn = (returnID: number, data: { action: "approve" | "reject"; note?: string }) =>
	patchData({ endPoint: `v1/returns/${returnID}/review`, data });

export const processRefund = (returnID: number) =>
	postData({ endPoint: `v1/returns/${returnID}/refund`, data: {} });

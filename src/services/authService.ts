import type { LoginPayload, LoginResponse } from "../types/authTypes";
import { postData } from "./services";

export const login = async (
	credentials: LoginPayload
): Promise<LoginResponse> => {
	return postData({
		endPoint: `/v1/auth/login`,
		data: credentials,
	});
};

export const sendOTP = (phone: string) =>
	postData({ endPoint: "/v1/auth", data: { phone } });

export const verifyOTP = (phone: string, otp: string) =>
	postData({ endPoint: "/v1/auth/verify", data: { phone, otp } });

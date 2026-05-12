import { postData } from "./services";

export const sendOTP = (phone: string) =>
	postData({ endPoint: "/v1/auth", data: { phone } });

export const verifyOTP = (phone: string, otp: string) =>
	postData({ endPoint: "/v1/auth/verify", data: { phone, otp } });

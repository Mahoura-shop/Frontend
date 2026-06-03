import { apiPost, E2E_ADMIN_PHONE, E2E_CUSTOMER_PHONE } from "./api";

export async function loginAsCustomer(phone = E2E_CUSTOMER_PHONE): Promise<string> {
  await apiPost("/v1/auth", { phone });
  const res = await apiPost("/v1/auth/verify", { phone, otp: "111111" });
  return res.data.accessToken as string;
}

export async function loginAsAdmin(phone = E2E_ADMIN_PHONE): Promise<string> {
  await apiPost("/v1/auth", { phone });
  const res = await apiPost("/v1/auth/verify", { phone, otp: "111111" });
  return res.data.accessToken as string;
}

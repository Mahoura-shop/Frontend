import { apiPost } from "./api";

export async function resetDB() {
  await apiPost("/v1/test/reset", {});
}

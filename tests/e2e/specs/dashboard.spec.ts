import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginCustomerViaUI } from "../helpers/ui-auth";

test.beforeAll(async () => {
	await resetDB();
});

test("authenticated customer can access dashboard", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard");
	await expect(page).toHaveURL(/dashboard/);
});

test("unauthenticated user is redirected from dashboard", async ({ page }) => {
	await page.goto("/dashboard");
	await expect(page).not.toHaveURL(/dashboard/);
});

test("dashboard orders page loads", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/orders");
	await expect(page).toHaveURL(/dashboard\/orders/);
});

test("dashboard wallet page loads", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/wallet");
	await expect(page).toHaveURL(/dashboard\/wallet/);
});

test("dashboard addresses page loads", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/addresses");
	await expect(page).toHaveURL(/dashboard\/addresses/);
});

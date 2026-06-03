import { expect } from "@playwright/test";
import { E2E_ADMIN_PHONE, E2E_CUSTOMER_PHONE } from "./api";

export async function loginAdminViaUI(page: import("@playwright/test").Page) {
	await page.goto("/signin");
	await page.getByTestId("phone").fill(E2E_ADMIN_PHONE);
	await page.getByTestId("submit1").click();

	for (let i = 0; i < 6; i++) {
		await page.getByTestId(`otp-${i}`).fill("1");
	}

	try {
		await page.getByTestId("firstname").waitFor({ timeout: 5000 });
		await page.getByTestId("firstname").fill("Admin");
		await page.getByTestId("lastname").fill("Test");
		await page.getByTestId("submit3").click();
	} catch {
		// name step skipped — admin already has a name
	}

	await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });
}

export async function loginCustomerViaUI(
	page: import("@playwright/test").Page,
	phone = E2E_CUSTOMER_PHONE,
) {
	await page.goto("/signin");
	await page.getByTestId("phone").fill(phone);
	await page.getByTestId("submit1").click();

	for (let i = 0; i < 6; i++) {
		await page.getByTestId(`otp-${i}`).fill("1");
	}

	try {
		await page.getByTestId("firstname").waitFor({ timeout: 5000 });
		await page.getByTestId("firstname").fill("Customer");
		await page.getByTestId("lastname").fill("Test");
		await page.getByTestId("submit3").click();
	} catch {
		// name step skipped
	}

	await page.waitForURL(/\/(?!signin)/, { timeout: 15000 });
}

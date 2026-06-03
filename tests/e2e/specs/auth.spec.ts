import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { E2E_CUSTOMER_PHONE } from "../helpers/api";

test.beforeAll(async () => {
	await resetDB();
});

test("customer can request OTP and log in", async ({ page }) => {
	await page.goto("/signin");
	await page.getByTestId("phone").fill(E2E_CUSTOMER_PHONE);
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
		// already has name
	}

	await page.waitForURL(/\/(?!signin)/, { timeout: 15000 });
});

test("wrong OTP shows error", async ({ page }) => {
	await page.goto("/signin");
	await page.getByTestId("phone").fill(E2E_CUSTOMER_PHONE);
	await page.getByTestId("submit1").click();

	for (let i = 0; i < 6; i++) {
		await page.getByTestId(`otp-${i}`).fill("9");
	}

	await expect(page).toHaveURL(/signin/, { timeout: 8000 });
});

test("invalid phone (too short) keeps submit disabled", async ({ page }) => {
	await page.goto("/signin");
	await page.getByTestId("phone").fill("0912");
	await expect(page.getByTestId("submit1")).toBeDisabled();
});

test("logout clears session and redirects to signin", async ({ page }) => {
	await page.goto("/signin");
	await page.getByTestId("phone").fill(E2E_CUSTOMER_PHONE);
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
		// already has name
	}

	await page.waitForURL(/\/(?!signin)/, { timeout: 15000 });
	await expect(page.getByTestId("navbar-profile")).toBeVisible({ timeout: 5000 });
	await page.getByTestId("navbar-profile").click();
	await expect(page.getByTestId("logout")).toBeVisible({ timeout: 3000 });
	await page.getByTestId("logout").click();
	await expect(page).toHaveURL("http://localhost:3000/");
});

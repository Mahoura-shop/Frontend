import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { apiPost } from "../helpers/api";
import { loginAdminViaUI } from "../helpers/ui-auth";

test.beforeAll(async () => {
	await resetDB();
	// Seed a contact message via API so admin tests don't depend on UI form
	await apiPost("/v1/contact", {
		name: "Ali Tester",
		email: "ali@test.com",
		subject: "تست سیستم",
		message: "این یک پیام تست است برای بررسی سیستم",
	});
});

test("customer submits contact form", async ({ page }) => {
	await page.goto("/contact");
	await page.getByTestId("contact-name").fill("Ali Tester");
	await page.getByTestId("contact-email").fill("ali@test.com");
	await page.getByTestId("contact-subject").fill("تست سیستم");
	await page.getByTestId("contact-message").fill("این یک پیام تست است برای بررسی سیستم");
	await page.getByTestId("contact-submit").click();
	await expect(page.locator('[data-test="sonner-toastn"]')).toBeVisible({ timeout: 5000 });
});

test("submitted message appears in admin contacts page", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/contacts");
	await expect(page.locator("tbody").getByText("Ali Tester").first()).toBeVisible({ timeout: 8000 });
	await expect(page.locator("tbody").getByText("تست سیستم").first()).toBeVisible();
});

test("admin can search and open a contact message", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/contacts");
	await page.getByTestId("contacts-search").fill("Ali Tester");
	await expect(page.locator("tbody").getByText("Ali Tester").first()).toBeVisible({ timeout: 5000 });
	await page.locator("tbody").getByText("تست سیستم").first().click();
	await expect(page.getByTestId("message-detail")).toBeVisible({ timeout: 5000 });
	await expect(page.getByTestId("message-detail")).toContainText("این یک پیام تست است");
});

test("empty contact form is rejected with validation", async ({ page }) => {
	await page.goto("/contact");
	await page.getByTestId("contact-submit").click();
	await expect(page).toHaveURL(/contact/);
	await expect(page.getByTestId("contact-submit")).not.toBeDisabled();
});

test("invalid email is rejected", async ({ page }) => {
	await page.goto("/contact");
	await page.getByTestId("contact-name").fill("Test");
	await page.getByTestId("contact-email").fill("not-an-email");
	await page.getByTestId("contact-subject").fill("موضوع");
	await page.getByTestId("contact-message").fill("پیام تست با طول کافی برای اعتبارسنجی");
	await page.getByTestId("contact-submit").click();
	await expect(page).toHaveURL(/contact/);
});

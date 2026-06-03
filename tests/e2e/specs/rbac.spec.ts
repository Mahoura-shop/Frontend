import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAdminViaUI } from "../helpers/ui-auth";

test.beforeAll(async () => {
	await resetDB();
});

test("admin roles page loads", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/roles");
	await expect(page).toHaveURL(/admin\/roles/);
});

test("admin can create a role", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/roles");

	const createBtn = page.getByTestId("create-role");
	await expect(createBtn).toBeVisible({ timeout: 8000 });

	await createBtn.click();
	await page.getByTestId("role-name").fill("نقش تست");
	const permCheckboxes = await page.locator("input[type='checkbox']").all();
	if (permCheckboxes.length > 0) {
		await permCheckboxes[0].check({ force: true });
	}
	await page.getByTestId("submit-role").click();
	await expect(page.locator("text=نقش تست")).toBeVisible({ timeout: 8000 });
});

test("admin permissions page loads", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/roles");
	await expect(page).toHaveURL(/admin\/roles/);
	await expect(page.locator("main")).toBeVisible();
});

test("sub-admins page loads", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/subadmins");
	await expect(page).toHaveURL(/admin\/subadmins/);
});

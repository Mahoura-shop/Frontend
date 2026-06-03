import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { apiDelete, apiGet, apiPut, E2E_ADMIN_PHONE } from "../helpers/api";
import { loginAdminViaUI } from "../helpers/ui-auth";

test.beforeAll(async () => {
	await resetDB();
});

test("admin dashboard loads", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/dashboard");
	await expect(page).toHaveURL(/admin\/dashboard/);
});

test("admin can create brand", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/brands");
	await page.getByTestId("create").click();
	await page.getByTestId("persian").fill("برند تست");
	await page.getByTestId("english").fill("test-brand-e2e");
	await page.getByTestId("submit").click();
	await expect(page.locator("text=برند تست")).toBeVisible({ timeout: 8000 });
});

test("admin can create category", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/categories");
	await page.getByTestId("create").click();
	await page.getByTestId("persian").fill("دسته تست");
	await page.getByTestId("english").fill("test-category-e2e");
	await page.getByTestId("submit").click();
	await expect(page.locator("text=دسته تست")).toBeVisible({ timeout: 8000 });
});

test("admin can create product (requires brand and category)", async ({ page }) => {
	const token = await loginAsAdmin();
	await seedBrand(token, "برند محصول", "brand-product");
	await seedCategory(token, "دسته محصول", "cat-product");

	await loginAdminViaUI(page);
	await page.goto("/admin/products");
	await page.getByTestId("create").click();
	await page.getByTestId("persian").fill("محصول تست E2E");
	await page.getByTestId("english").fill("e2e-product-admin");
	await page.getByTestId("price").fill("200000");
	await page.getByTestId("consumer-price").fill("200000");
	await page.getByTestId("inventory").fill("5");
	await page.getByTestId("category").click();
	await page.getByRole("option").first().click();
	await page.getByTestId("brand").click();
	await page.getByRole("option").first().click();
	await page.getByTestId("submit").click();
	await expect(page.locator("tbody").getByText("محصول تست E2E")).toBeVisible({ timeout: 10000 });
});

test("admin can see order list", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/orders");
	await expect(page).toHaveURL(/admin\/orders/);
});

test("admin can see user list", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/users");
	await expect(page).toHaveURL(/admin\/users/);
});

test("non-admin is blocked from admin routes", async ({ page }) => {
	await page.goto("/admin/dashboard");
	await expect(page).not.toHaveURL(/admin\/dashboard/);
});

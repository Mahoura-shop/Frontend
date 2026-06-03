import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";

test.beforeAll(async () => {
	await resetDB();
	const adminToken = await loginAsAdmin();
	const brand = await seedBrand(adminToken, "برند مرور", "browse-brand");
	const category = await seedCategory(adminToken, "دسته مرور", "browse-cat");
	await seedProduct(adminToken, category.id, brand.id, {
		name: "محصول مرور",
		slug: "browse-product",
		price: 80000,
		currencyID: 1,
		consumerPrice: 80000,
		step1Price: 60000,
		step2Price: 65000,
		step3Price: 70000,
		step4Price: 75000,
		quantity: 5,
	});
});

test("category detail — page loads with category name", async ({ page }) => {
	await page.goto("/categories/browse-cat");
	await expect(page.getByRole("heading", { name: "دسته مرور" })).toBeVisible({ timeout: 10000 });
});

test("category detail — shows seeded product in grid", async ({ page }) => {
	await page.goto("/categories/browse-cat");
	await expect(page.locator("text=محصول مرور")).toBeVisible({ timeout: 10000 });
});

test("category detail — product card links to product detail", async ({ page }) => {
	await page.goto("/categories/browse-cat");
	await page.locator("text=محصول مرور").first().click();
	await expect(page).toHaveURL(/browse-product/);
});

test("brand detail — page loads with brand name", async ({ page }) => {
	await page.goto("/brands/browse-brand");
	await expect(page.getByRole("heading", { name: "برند مرور" })).toBeVisible({ timeout: 10000 });
});

test("brand detail — shows seeded product in grid", async ({ page }) => {
	await page.goto("/brands/browse-brand");
	await expect(page.locator("text=محصول مرور")).toBeVisible({ timeout: 10000 });
});

test("brand detail — product card links to product detail", async ({ page }) => {
	await page.goto("/brands/browse-brand");
	await page.locator("text=محصول مرور").first().click();
	await expect(page).toHaveURL(/browse-product/);
});

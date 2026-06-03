import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { apiGet } from "../helpers/api";
import { loginAdminViaUI } from "../helpers/ui-auth";

let productId: number;

test.beforeAll(async () => {
	await resetDB();
	const token = await loginAsAdmin();
	const brand = await seedBrand(token, "برند موجودی", "inv-brand");
	const category = await seedCategory(token, "دسته موجودی", "inv-cat");
	const product = await seedProduct(token, category.id, brand.id, {
		name: "محصول موجودی",
		slug: "inv-product",
		price: 100000,
		currencyID: 1,
		consumerPrice: 100000,
		step1Price: 80000,
		step2Price: 85000,
		step3Price: 90000,
		step4Price: 95000,
		quantity: 5,
	});
	productId = product.id;
});

test("admin inventory page loads", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/inventory");
	await expect(page).toHaveURL(/admin\/inventory/);
	await expect(page.getByTestId("op-buy")).toBeVisible();
});

test("admin adds buy inventory — quantity increases", async ({ page }) => {
	const before = await apiGet(`/v1/products/slug/inv-product`);
	const qtyBefore = before?.data?.quantity as number;

	await loginAdminViaUI(page);
	await page.goto("/admin/inventory");

	await page.getByTestId("op-buy").click();

	// Select product in combobox row 0
	const combobox = page.locator("[role='combobox']").first();
	await combobox.click();
	await page.locator(`text=محصول موجودی`).first().click();

	await page.getByTestId("row-qty-0").fill("3");
	await page.getByTestId("submit-inventory").click();
	await page.waitForTimeout(1500);

	const after = await apiGet(`/v1/products/slug/inv-product`);
	expect(after?.data?.quantity).toBe(qtyBefore + 3);
});

test("admin submits sell inventory — quantity decreases", async ({ page }) => {
	const before = await apiGet(`/v1/products/slug/inv-product`);
	const qtyBefore = before?.data?.quantity as number;

	await loginAdminViaUI(page);
	await page.goto("/admin/inventory");

	await page.getByTestId("op-sell").click();

	const combobox = page.locator("[role='combobox']").first();
	await combobox.click();
	await page.locator(`text=محصول موجودی`).first().click();

	await page.getByTestId("row-qty-0").fill("2");
	await page.getByTestId("submit-inventory").click();
	await page.waitForTimeout(1500);

	const after = await apiGet(`/v1/products/slug/inv-product`);
	expect(after?.data?.quantity).toBe(qtyBefore - 2);
});

test("submit with empty product row shows validation", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/inventory");

	// Leave row empty and submit
	await page.getByTestId("submit-inventory").click();
	// Should stay on the same page (not navigate away)
	await expect(page).toHaveURL(/admin\/inventory/);
});

test("admin can add multiple rows", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/inventory");

	await page.getByTestId("add-row").click();
	await expect(page.getByTestId("row-qty-1")).toBeVisible({ timeout: 3000 });
});

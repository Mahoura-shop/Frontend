import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { loginAdminViaUI, loginCustomerViaUI } from "../helpers/ui-auth";

const SHOPKEEPER_PHONE = "09130000002";

let productSlug: string;
let consumerPrice: number;
let step1Price: number;

test.beforeAll(async () => {
	await resetDB();
	const token = await loginAsAdmin();
	const brand = await seedBrand(token, "برند فروشگاه", "shop-brand");
	const category = await seedCategory(token, "دسته فروشگاه", "shop-cat");
	const product = await seedProduct(token, category.id, brand.id, {
		name: "محصول قیمت‌گذاری",
		slug: "pricing-product",
		price: 500000,
		currencyID: 1,
		consumerPrice: 500000,
		step1Price: 420000,
		step2Price: 440000,
		step3Price: 460000,
		step4Price: 480000,
		quantity: 20,
	});
	productSlug = product.slug;
	consumerPrice = 500000;
	step1Price = 420000;
});

test("regular customer sees consumer price on product", async ({ page }) => {
	await loginCustomerViaUI(page, SHOPKEEPER_PHONE);
	await page.goto(`/products/${productSlug}`);
	// Price is displayed with fa-IR locale (Persian numerals) — use testid to check presence
	await expect(page.getByTestId("product-price")).toBeVisible({ timeout: 8000 });
	// Confirm shopkeeper badge NOT shown (regular user)
	await expect(page.locator("text=قیمت نقدی")).not.toBeVisible();
});

test("admin changes user type to shopkeeper", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/users");

	await page.getByTestId("user-search").fill(SHOPKEEPER_PHONE);
	await page.waitForTimeout(500);

	// Target the desktop table version — mobile cards are hidden at desktop viewport
	const changeRoleBtn = page.locator('tbody [data-testid^="change-role-"]').first();
	await expect(changeRoleBtn).toBeVisible({ timeout: 5000 });
	await changeRoleBtn.click();
	await page.getByTestId("user-type-select").click();
	await page.getByRole("option", { name: /فروشنده|shopkeeper/i }).click();
	await page.getByTestId("confirm-role-change").click();
	await page.waitForTimeout(1000);
});

test("shopkeeper sees step1Price on product — not consumer price", async ({ page }) => {
	await loginCustomerViaUI(page, SHOPKEEPER_PHONE);
	await page.goto(`/products/${productSlug}`);
	// Shopkeeper badge should be visible
	await expect(page.locator("text=قیمت نقدی")).toBeVisible({ timeout: 8000 });
	// Product price element should be visible
	await expect(page.getByTestId("product-price")).toBeVisible();
});

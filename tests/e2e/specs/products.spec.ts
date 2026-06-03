import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { loginCustomerViaUI } from "../helpers/ui-auth";

test.beforeAll(async () => {
	await resetDB();
	const token = await loginAsAdmin();
	const catA = await seedCategory(token, "لپ‌تاپ", "laptop");
	const catB = await seedCategory(token, "موبایل", "mobile");
	const brand = await seedBrand(token, "سامسونگ", "samsung");

	await seedProduct(token, catA.id, brand.id, {
		name: "لپ‌تاپ گیمینگ",
		slug: "gaming-laptop",
		price: 80000000,
		currencyID: 1,
		consumerPrice: 80000000,
		step1Price: 70000000,
		step2Price: 72000000,
		step3Price: 74000000,
		step4Price: 76000000,
		quantity: 5,
	});
	await seedProduct(token, catB.id, brand.id, {
		name: "گوشی هوشمند",
		slug: "smart-phone",
		price: 20000000,
		currencyID: 1,
		consumerPrice: 20000000,
		step1Price: 16000000,
		step2Price: 17000000,
		step3Price: 18000000,
		step4Price: 19000000,
		quantity: 10,
	});
	await seedProduct(token, catA.id, brand.id, {
		name: "لپ‌تاپ اداری",
		slug: "office-laptop",
		price: 30000000,
		currencyID: 1,
		consumerPrice: 30000000,
		step1Price: 25000000,
		step2Price: 26000000,
		step3Price: 27000000,
		step4Price: 28000000,
		quantity: 8,
	});
});

test("product list loads and shows seeded products", async ({ page }) => {
	await page.goto("/products");
	await expect(page.locator("text=لپ‌تاپ گیمینگ")).toBeVisible({ timeout: 8000 });
	await expect(page.locator("text=گوشی هوشمند")).toBeVisible();
});

test("searching by name filters results", async ({ page }) => {
	await page.goto("/products");
	const searchInput = page.getByTestId("product-search");
	await searchInput.fill("گوشی");
	await page.waitForTimeout(600);
	await expect(page.locator("text=گوشی هوشمند")).toBeVisible({ timeout: 5000 });
	await expect(page.locator("text=لپ‌تاپ گیمینگ")).not.toBeVisible();
});

test("no results shown for unknown search term", async ({ page }) => {
	await page.goto("/products");
	const searchInput = page.getByTestId("product-search");
	await searchInput.fill("xyznotexistproduct999");
	await page.waitForTimeout(600);
	await expect(page.locator("text=لپ‌تاپ گیمینگ")).not.toBeVisible({ timeout: 5000 });
});

test("sort by price-low renders without error", async ({ page }) => {
	await page.goto("/products");
	await page.getByTestId("sort-select").click();
	await page.getByRole("option", { name: "ارزان‌ترین" }).click();
	await page.waitForTimeout(800);
	await expect(page.locator("text=لپ‌تاپ گیمینگ")).toBeVisible({ timeout: 5000 });
});

test("product detail page loads and shows add to cart for logged-in user", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/products/gaming-laptop");
	await expect(page.getByRole("heading", { name: "لپ‌تاپ گیمینگ" })).toBeVisible({ timeout: 8000 });
	await expect(page.getByTestId("add-to-cart").or(page.getByTestId("add-to-cart-increment"))).toBeVisible({ timeout: 5000 });
});

test("add to cart button hidden for unauthenticated user", async ({ page }) => {
	await page.goto("/products/gaming-laptop");
	await expect(page.getByTestId("add-to-cart")).not.toBeVisible({ timeout: 5000 });
});

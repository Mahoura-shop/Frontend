import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin, loginAsCustomer } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { apiPost } from "../helpers/api";
import { loginCustomerViaUI } from "../helpers/ui-auth";

let productSlug: string;
let productId: number;

test.beforeAll(async () => {
	await resetDB();
	const token = await loginAsAdmin();
	const category = await seedCategory(token, "دسته سبد", "cart-cat");
	const brand = await seedBrand(token, "برند سبد", "cart-brand");
	const product = await seedProduct(token, category.id, brand.id, {
		name: "محصول سبد",
		slug: "cart-product",
		price: 100000,
		currencyID: 1,
		consumerPrice: 100000,
		step1Price: 80000,
		step2Price: 85000,
		step3Price: 90000,
		step4Price: 95000,
		quantity: 10,
	});
	productSlug = product.slug;
	productId = product.id;
});

test("logged-in customer can add product to cart", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto(`/products/${productSlug}`);
	await page.getByTestId("add-to-cart").click();
	await expect(page.getByTestId("cart-count")).toBeVisible({ timeout: 5000 });
});

test("cart page shows added item", async ({ page }) => {
	// Add via API to avoid UI state dependency from previous test
	const customerToken = await loginAsCustomer();
	await apiPost(`/v1/cart/${productId}/add`, {}, customerToken);

	await loginCustomerViaUI(page);
	await page.goto("/cart");
	await expect(page.locator("text=محصول سبد")).toBeVisible({ timeout: 8000 });
});

test("unauthenticated user is redirected from cart", async ({ page }) => {
	await page.goto("/cart");
	await expect(page).not.toHaveURL(/\/cart/);
});

test("add-to-cart button hidden for unauthenticated user", async ({ page }) => {
	await page.goto(`/products/${productSlug}`);
	await expect(page.getByTestId("add-to-cart")).not.toBeVisible({ timeout: 5000 });
});

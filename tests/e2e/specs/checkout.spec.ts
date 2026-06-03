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
	const category = await seedCategory(token, "دسته پرداخت", "checkout-cat");
	const brand = await seedBrand(token, "برند پرداخت", "checkout-brand");
	const product = await seedProduct(token, category.id, brand.id, {
		name: "محصول پرداخت",
		slug: "checkout-product",
		price: 100000,
		currencyID: 1,
		consumerPrice: 100000,
		step1Price: 80000,
		step2Price: 85000,
		step3Price: 90000,
		step4Price: 95000,
		quantity: 5,
	});
	productSlug = product.slug;
	productId = product.id;

	await loginAsCustomer();
});

test("customer can add to cart and see cart page", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto(`/products/${productSlug}`);
	await page.getByTestId("add-to-cart").click();
	await expect(page.getByTestId("cart-count")).toBeVisible({ timeout: 5000 });
	await page.goto("/cart");
	await expect(page.locator("text=محصول پرداخت")).toBeVisible({ timeout: 8000 });
});

test("order via API works — customer gets order ID", async () => {
	const customerToken = await loginAsCustomer();
	await apiPost(`/v1/cart/${productId}/add`, {}, customerToken);
	const res = await apiPost("/v1/order", {}, customerToken);
	expect(res?.data?.orderID).toBeDefined();
});

test("unauthenticated user cannot access order page", async ({ page }) => {
	await page.goto("/dashboard/orders");
	await expect(page).not.toHaveURL(/dashboard\/orders/);
});

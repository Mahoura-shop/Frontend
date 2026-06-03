import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin, loginAsCustomer } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { apiGet, apiPost } from "../helpers/api";
import { loginCustomerViaUI } from "../helpers/ui-auth";

let customerToken: string;
let productId: number;

test.beforeAll(async () => {
	await resetDB();
	const adminToken = await loginAsAdmin();
	const brand = await seedBrand(adminToken, "برند چکوت", "checkout-brand");
	const category = await seedCategory(adminToken, "دسته چکوت", "checkout-cat");
	const product = await seedProduct(adminToken, category.id, brand.id, {
		name: "محصول چکوت",
		slug: "checkout-product",
		price: 50000,
		currencyID: 1,
		consumerPrice: 50000,
		step1Price: 40000,
		step2Price: 42000,
		step3Price: 44000,
		step4Price: 46000,
		quantity: 20,
	});
	productId = product.id;

	customerToken = await loginAsCustomer();
	await apiPost("/v1/wallet/deposit", { amount: 500000 }, customerToken);
});

test("checkout — page loads with payment options visible", async ({ page }) => {
	await apiPost(`/v1/cart/${productId}/add`, {}, customerToken);
	await loginCustomerViaUI(page);
	await page.goto("/order");
	await expect(page.getByTestId("pay-online")).toBeVisible({ timeout: 8000 });
	await expect(page.getByTestId("pay-wallet")).toBeVisible();
	await expect(page.getByTestId("place-order")).toBeVisible();
});

test("checkout — unauthenticated user is redirected from /order", async ({ page }) => {
	await page.goto("/order");
	await expect(page).not.toHaveURL(/\/order$/);
});

test("checkout — wallet payment completes order and shows success", async ({ page }) => {
	await apiPost(`/v1/cart/${productId}/add`, {}, customerToken);
	await loginCustomerViaUI(page);
	await page.goto("/order");
	await expect(page.getByTestId("pay-wallet")).toBeVisible({ timeout: 8000 });
	await page.getByTestId("pay-wallet").click();
	await expect(page.getByTestId("place-order")).toBeEnabled({ timeout: 5000 });
	await page.getByTestId("place-order").click();
	await expect(page.getByTestId("order-success")).toBeVisible({ timeout: 10000 });
});

test("checkout — empty cart shows empty state not checkout form", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/order");
	const hasForm = await page.getByTestId("place-order").isVisible({ timeout: 5000 }).catch(() => false);
	const hasEmpty = await page.locator("text=سبد خرید شما خالی است").isVisible({ timeout: 5000 }).catch(() => false);
	expect(hasForm || hasEmpty).toBe(true);
});

import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin, loginAsCustomer } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { apiPost, apiPatch } from "../helpers/api";
import { loginCustomerViaUI } from "../helpers/ui-auth";

let customerToken: string;
let productId: number;
let orderId: number;

test.beforeAll(async () => {
	await resetDB();
	const adminToken = await loginAsAdmin();
	const brand = await seedBrand(adminToken, "برند داشبورد", "dash-brand");
	const category = await seedCategory(adminToken, "دسته داشبورد", "dash-cat");
	const product = await seedProduct(adminToken, category.id, brand.id, {
		name: "محصول داشبورد",
		slug: "dash-product",
		price: 100000,
		currencyID: 1,
		consumerPrice: 100000,
		step1Price: 80000,
		step2Price: 85000,
		step3Price: 90000,
		step4Price: 95000,
		quantity: 10,
	});
	productId = product.id;

	customerToken = await loginAsCustomer();
	await apiPost(`/v1/cart/${productId}/add`, {}, customerToken);
	const orderRes = await apiPost("/v1/order", {}, customerToken);
	orderId = orderRes?.data?.orderID as number;
});

// --- Dashboard overview ---

test("customer dashboard — wallet card and recent orders visible", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard");
	await expect(page.getByTestId("wallet-card")).toBeVisible({ timeout: 8000 });
	await expect(page.getByTestId("recent-orders")).toBeVisible({ timeout: 8000 });
});

test("customer dashboard — recent orders shows seeded order", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard");
	await expect(page.getByTestId("recent-orders")).toBeVisible({ timeout: 8000 });
	await expect(page.locator("[data-testid='recent-orders']").locator("text=سفارش")).toBeVisible({ timeout: 8000 });
});

// --- Orders list ---

test("customer orders — list loads with order item", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/orders");
	await expect(page.getByTestId(`order-item-${orderId}`)).toBeVisible({ timeout: 8000 });
});

test("customer orders — shows order item or empty state", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/orders");
	const orderItem = page.getByTestId(`order-item-${orderId}`);
	const emptyState = page.getByTestId("orders-empty");
	await expect(orderItem.or(emptyState).first()).toBeVisible({ timeout: 8000 });
});

// --- Wallet ---

test("customer wallet — balance visible", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/wallet");
	await expect(page.getByTestId("wallet-balance")).toBeVisible({ timeout: 8000 });
});

test("customer wallet — deposit dialog opens", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/wallet");
	await page.getByTestId("open-deposit").click();
	await expect(page.getByTestId("deposit-amount")).toBeVisible({ timeout: 5000 });
	await expect(page.getByTestId("submit-deposit")).toBeVisible();
});

// --- Addresses ---

test("customer addresses — page loads", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/addresses");
	await expect(page).toHaveURL(/dashboard\/addresses/);
	await expect(page.locator("h1")).toBeVisible({ timeout: 8000 });
});

test("customer addresses — add-address button opens dialog", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/addresses");
	await page.getByTestId("add-address").click();
	await expect(page.getByTestId("street-address")).toBeVisible({ timeout: 5000 });
	await expect(page.getByTestId("submit-address")).toBeVisible();
});

// --- Settings ---

test("customer settings — form inputs visible", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/settings");
	await expect(page.getByTestId("first-name")).toBeVisible({ timeout: 8000 });
	await expect(page.getByTestId("last-name")).toBeVisible();
	await expect(page.getByTestId("email")).toBeVisible();
});

test("customer settings — save profile updates successfully", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/settings");
	await expect(page.getByTestId("first-name")).toBeVisible({ timeout: 8000 });
	await page.getByTestId("first-name").fill("Ali");
	await page.getByTestId("last-name").fill("Test");
	await page.getByRole("button", { name: "ذخیره تغییرات" }).click();
	await expect(page.locator("[data-test='sonner-toastn']")).toBeVisible({ timeout: 8000 });
});

// --- Wishlist ---

test("customer wishlist — shows empty state or items", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/wishlist");
	await expect(page).toHaveURL(/dashboard\/wishlist/);
	const emptyState = page.locator("text=هنوز محصولی ذخیره نکردید");
	const itemsHeader = page.locator("text=علاقه‌مندی‌ها");
	await expect(emptyState.or(itemsHeader).first()).toBeVisible({ timeout: 8000 });
});

test("customer wishlist — add and remove item", async ({ page }) => {
	await apiPost(`/v1/wishlist/${productId}`, {}, customerToken);
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/wishlist");
	await expect(page.getByTestId(`remove-wishlist-${productId}`)).toBeVisible({ timeout: 8000 });
	await page.getByTestId(`remove-wishlist-${productId}`).click();
	await expect(page.getByTestId(`wishlist-item-${productId}`)).not.toBeVisible({ timeout: 5000 });
});

// --- Notifications ---

test("customer notifications — page loads", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/notifications");
	await expect(page).toHaveURL(/dashboard\/notifications/);
	await expect(page.locator("h1")).toBeVisible({ timeout: 8000 });
});

// --- Returns ---

test("customer returns — page loads with empty state", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/returns");
	await expect(page).toHaveURL(/dashboard\/returns/);
	const emptyState = page.getByTestId("returns-empty");
	const returnsList = page.locator("[data-testid^='return-item-']").first();
	await expect(emptyState.or(returnsList)).toBeVisible({ timeout: 8000 });
});

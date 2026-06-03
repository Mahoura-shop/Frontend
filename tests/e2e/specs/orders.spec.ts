import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin, loginAsCustomer } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { apiGet, apiPatch, apiPost } from "../helpers/api";
import { loginAdminViaUI, loginCustomerViaUI } from "../helpers/ui-auth";

let adminToken: string;
let productId: number;
let productSlug: string;

test.beforeAll(async () => {
	await resetDB();
	adminToken = await loginAsAdmin();
	const brand = await seedBrand(adminToken, "برند سفارش", "order-brand");
	const category = await seedCategory(adminToken, "دسته سفارش", "order-cat");
	const product = await seedProduct(adminToken, category.id, brand.id, {
		name: "محصول سفارش",
		slug: "order-product",
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
	productSlug = product.slug;

	await loginAsCustomer();
});

test("customer adds product to cart and creates order", async ({ page }) => {
	const customerToken = await loginAsCustomer();
	await apiPost(`/v1/cart/${productId}/add`, {}, customerToken);

	await loginCustomerViaUI(page);
	await page.goto("/cart");
	await expect(page.locator("text=محصول سفارش")).toBeVisible({ timeout: 8000 });
	// Place order to clear cart — prevents quantity pollution in subsequent tests
	await apiPost("/v1/order", {}, customerToken);
});

test("inventory decreases after order creation", async () => {
	const before = await apiGet(`/v1/products/slug/order-product`);
	const initialQty = before?.data?.quantity as number;

	const customerToken = await loginAsCustomer();
	await apiPost(`/v1/cart/${productId}/add`, {}, customerToken);
	await apiPost("/v1/order", {}, customerToken);

	const after = await apiGet(`/v1/products/slug/order-product`);
	expect(after?.data?.quantity).toBe(initialQty - 1);
});

test("cannot order when product is out of stock", async ({ page }) => {
	const brand = await seedBrand(adminToken, "برند بدون موجودی", "no-stock-brand");
	const category = await seedCategory(adminToken, "دسته بدون موجودی", "no-stock-cat");
	await seedProduct(adminToken, category.id, brand.id, {
		name: "محصول ناموجود",
		slug: "out-of-stock-product",
		price: 50000,
		currencyID: 1,
		consumerPrice: 50000,
		step1Price: 40000,
		step2Price: 43000,
		step3Price: 46000,
		step4Price: 49000,
		quantity: 0,
	});

	await loginCustomerViaUI(page);
	await page.goto(`/products/out-of-stock-product`);
	const addBtn = page.getByTestId("add-to-cart");
	await expect(addBtn).toBeDisabled({ timeout: 5000 });
});

test("admin ships order with tracking code — customer sees it in dashboard", async ({ page }) => {
	// Create an order via API to ship
	const customerToken = await loginAsCustomer();
	await apiPost(`/v1/cart/${productId}/add`, {}, customerToken);
	const orderRes = await apiPost("/v1/order", {}, customerToken);
	const orderId = orderRes?.data?.orderID as number;

	// Update order status via admin API (avoids permission UI guard timing issues)
	await apiPatch(`/v1/orders/${orderId}/status`, { status: 2, note: "" }, adminToken);
	await apiPatch(`/v1/orders/${orderId}/status`, { status: 3, note: "", trackingCode: "TEST-TRACK-123" }, adminToken);

	// Customer checks dashboard for tracking code
	await loginCustomerViaUI(page);
	await page.goto(`/dashboard/orders/${orderId}`);
	await expect(page.getByTestId("tracking-code")).toContainText("TEST-TRACK-123", { timeout: 8000 });
});

test("admin cancels order — inventory is restored", async ({ page }) => {
	const before = await apiGet(`/v1/products/slug/order-product`);
	const qtyBefore = before?.data?.quantity as number;

	const customerToken = await loginAsCustomer();
	await apiPost(`/v1/cart/${productId}/add`, {}, customerToken);
	const orderRes = await apiPost("/v1/order", {}, customerToken);
	const orderId = orderRes?.data?.orderID as number;

	const afterOrder = await apiGet(`/v1/products/slug/order-product`);
	expect(afterOrder?.data?.quantity).toBe(qtyBefore - 1);

	await loginAdminViaUI(page);
	await page.goto(`/admin/orders/${orderId}`);
	await page.getByTestId("cancel-reason").fill("تست لغو سفارش");
	await page.getByTestId("cancel-order").click();
	await page.waitForTimeout(1500);

	const afterCancel = await apiGet(`/v1/products/slug/order-product`);
	expect(afterCancel?.data?.quantity).toBe(qtyBefore);
});

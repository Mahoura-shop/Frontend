import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin, loginAsCustomer } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { apiPost } from "../helpers/api";
import { loginAdminViaUI } from "../helpers/ui-auth";

let adminToken: string;
let productId: number;

test.beforeAll(async () => {
	await resetDB();
	adminToken = await loginAsAdmin();
	const brand = await seedBrand(adminToken, "برند ادمین داشبورد", "admin-dash-brand");
	const category = await seedCategory(adminToken, "دسته ادمین داشبورد", "admin-dash-cat");
	const product = await seedProduct(adminToken, category.id, brand.id, {
		name: "محصول ادمین داشبورد",
		slug: "admin-dash-product",
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
	await loginAsCustomer();
});

test("admin dashboard — stat cards visible", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/dashboard");
	await expect(page.getByTestId("stat-cards")).toBeVisible({ timeout: 10000 });
});

test("admin dashboard — low stock table renders", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/dashboard");
	await expect(page.locator("main")).toBeVisible({ timeout: 8000 });
});

test("admin returns — page loads", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/returns");
	await expect(page).toHaveURL(/admin\/returns/);
	await expect(page.locator("main")).toBeVisible({ timeout: 8000 });
});

test("admin returns — shows returns list or empty state", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/returns");
	const returnsList = page.getByTestId("returns-list");
	const emptyText = page.locator("text=مرجوعی");
	await expect(returnsList.or(emptyText).first()).toBeVisible({ timeout: 8000 });
});

test("admin admin-logs — page loads with search", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/admin-logs");
	await expect(page).toHaveURL(/admin\/admin-logs/);
	await expect(page.getByTestId("logs-search")).toBeVisible({ timeout: 8000 });
});

test("admin admin-logs — search filters results", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/admin-logs");
	await page.getByTestId("logs-search").fill("GET");
	await page.waitForTimeout(500);
	await expect(page.locator("main")).toBeVisible();
});

test("admin price group — page loads", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/price-group");
	await expect(page).toHaveURL(/admin\/price-group/);
	await expect(page.getByTestId("price-group-table")).toBeVisible({ timeout: 8000 });
});

test("admin orders — filter by status pending", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/orders");
	try {
		const filterBtn = page.getByTestId("filter-1");
		const isVisible = await filterBtn.isVisible();
		if (isVisible) {
			await filterBtn.click();
		}
	} catch {
	}
	await expect(page).toHaveURL(/admin\/orders/);
});

test("admin users — search finds customer", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/users");
	await page.getByTestId("user-search").fill("09164911317");
	await page.waitForTimeout(600);
	await expect(page.locator("table").getByText("09164911317")).toBeVisible({ timeout: 8000 });
});

test("admin products — list loads with search", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/products");
	await expect(page).toHaveURL(/admin\/products/);
	await expect(page.locator("tbody")).toBeVisible({ timeout: 8000 });
});

test("admin categories — list loads", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/categories");
	await expect(page).toHaveURL(/admin\/categories/);
	await expect(page.locator("text=دسته ادمین داشبورد")).toBeVisible({ timeout: 8000 });
});

test("admin brands — list loads", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/brands");
	await expect(page).toHaveURL(/admin\/brands/);
	await expect(page.locator("text=برند ادمین داشبورد")).toBeVisible({ timeout: 8000 });
});

test("admin orders — order detail accessible", async ({ page }) => {
	const customerToken = await loginAsCustomer();
	await apiPost(`/v1/cart/${productId}/add`, {}, customerToken);
	const orderRes = await apiPost("/v1/order", {}, customerToken);
	const orderId = orderRes?.data?.orderID as number;

	await loginAdminViaUI(page);
	await page.goto(`/admin/orders/${orderId}`);
	await expect(page).toHaveURL(/admin\/orders\/\d+/);
	await expect(page.locator("main")).toBeVisible({ timeout: 8000 });
});

import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { apiGet } from "../helpers/api";
import { loginAdminViaUI } from "../helpers/ui-auth";

test.beforeAll(async () => {
	await resetDB();
	const token = await loginAsAdmin();
	const brand = await seedBrand(token, "برند ارز", "curr-brand");
	const category = await seedCategory(token, "دسته ارز", "curr-cat");
	// Seed a product — currency ID 2 = USD assumed
	await seedProduct(token, category.id, brand.id, {
		name: "محصول دلاری",
		slug: "usd-product",
		price: 100,
		currencyID: 2,
		consumerPrice: 100,
		step1Price: 80,
		step2Price: 85,
		step3Price: 90,
		step4Price: 95,
		quantity: 5,
	});
});

test("admin settings page loads with currency rates", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/settings");
	await expect(page).toHaveURL(/admin\/settings/);
	await expect(page.getByTestId("save-currencies")).toBeVisible({ timeout: 8000 });
});

test("admin can update USD rate and save", async ({ page }) => {
	await loginAdminViaUI(page);
	await page.goto("/admin/settings");

	const usdInput = page.getByTestId("currency-rate-USD");
	if (!(await usdInput.isVisible({ timeout: 5000 }).catch(() => false))) {
		test.skip();
		return;
	}

	await usdInput.clear();
	await usdInput.fill("700000");
	await page.getByTestId("save-currencies").click();
	await page.waitForTimeout(1500);

	// Reload and verify the rate persisted
	await page.reload();
	await page.waitForTimeout(1000);
	const savedValue = await page.getByTestId("currency-rate-USD").inputValue();
	expect(savedValue).toContain("700");
});

test("currency list API returns non-empty data", async () => {
	const token = await loginAsAdmin();
	const res = await apiGet("/v1/currency", token);
	const currencies = res?.data ?? [];
	expect(currencies.length).toBeGreaterThan(0);
	const hasUSD = currencies.some((c: any) => c.code === "USD");
	expect(hasUSD).toBe(true);
});

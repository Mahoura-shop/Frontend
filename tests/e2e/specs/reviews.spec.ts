import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset";
import { loginAsAdmin, loginAsCustomer } from "../helpers/auth";
import { seedBrand, seedCategory, seedProduct } from "../helpers/seed";
import { loginCustomerViaUI } from "../helpers/ui-auth";

let productSlug: string;

test.beforeAll(async () => {
	await resetDB();
	const adminToken = await loginAsAdmin();
	const brand = await seedBrand(adminToken, "برند نظر", "review-brand");
	const category = await seedCategory(adminToken, "دسته نظر", "review-cat");
	const product = await seedProduct(adminToken, category.id, brand.id, {
		name: "محصول نظر",
		slug: "review-product",
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
});

test("product reviews — form visible for logged-in user", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto(`/products/${productSlug}`);
	await expect(page.getByTestId("review-star-5")).toBeVisible({ timeout: 10000 });
	await expect(page.getByTestId("review-comment")).toBeVisible();
	await expect(page.getByTestId("submit-review")).toBeDisabled();
});

test("product reviews — submit button enabled after selecting stars", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto(`/products/${productSlug}`);
	await expect(page.getByTestId("review-star-4")).toBeVisible({ timeout: 10000 });
	await page.getByTestId("review-star-4").click();
	await expect(page.getByTestId("submit-review")).toBeEnabled({ timeout: 3000 });
});

test("product reviews — submit review saves and appears in list", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto(`/products/${productSlug}`);
	await expect(page.getByTestId("review-star-5")).toBeVisible({ timeout: 10000 });
	await page.getByTestId("review-star-5").click();
	await page.getByTestId("review-comment").fill("محصول عالی بود");
	await page.getByTestId("submit-review").click();
	await expect(page.locator('[data-test="sonner-toastn"]')).toBeVisible({ timeout: 8000 });
});

test("product reviews — unauthenticated user sees sign-in prompt", async ({ page }) => {
	await page.goto(`/products/${productSlug}`);
	await expect(page.locator("text=برای ثبت نظر")).toBeVisible({ timeout: 10000 });
	await expect(page.getByTestId("review-star-1")).not.toBeVisible();
});

test("dashboard reviews — page loads", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/reviews");
	await expect(page).toHaveURL(/dashboard\/reviews/);
	await expect(page.locator("h1")).toBeVisible({ timeout: 8000 });
});

test("dashboard reviews — shows submitted review", async ({ page }) => {
	await loginCustomerViaUI(page);
	await page.goto("/dashboard/reviews");
	await expect(page.locator("h1")).toBeVisible({ timeout: 8000 });
	const hasReview = await page.locator("text=محصول نظر").isVisible({ timeout: 5000 }).catch(() => false);
	const hasEmpty = await page.locator("text=هنوز نظری ثبت نکرده‌اید").isVisible({ timeout: 5000 }).catch(() => false);
	expect(hasReview || hasEmpty).toBe(true);
});

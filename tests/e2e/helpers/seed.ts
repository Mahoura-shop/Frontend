import { apiGet, apiPost } from "./api";

export async function seedCategory(token: string, name = "E2E Category", slug = "e2e-category") {
	await apiPost("/v1/category", { name, slug }, token);
	const res = await apiGet("/v1/category");
	const list: { id: number; slug: string }[] = res?.data ?? [];
	const found = list.find((c) => c.slug === slug);
	if (!found) throw new Error(`seedCategory: could not find created category slug="${slug}"`);
	return found;
}

export async function seedBrand(token: string, name = "E2E Brand", slug = "e2e-brand") {
	await apiPost("/v1/brand", { name, slug }, token);
	const res = await apiGet("/v1/brand");
	const list: { id: number; slug: string }[] = res?.data ?? [];
	const found = list.find((b) => b.slug === slug);
	if (!found) throw new Error(`seedBrand: could not find created brand slug="${slug}"`);
	return found;
}

export async function seedProduct(
	token: string,
	categoryId: number,
	brandId: number,
	overrides: Record<string, unknown> = {},
) {
	const slug = (overrides.slug as string) ?? "e2e-product";
	const payload = {
		name: "E2E Product",
		slug,
		description: "E2E test product",
		price: 500000,
		currencyID: 1,
		consumerPrice: 500000,
		step1Price: 410000,
		step2Price: 430000,
		step3Price: 450000,
		step4Price: 470000,
		quantity: 10,
		minOrder: 1,
		categoryId,
		brandId,
		...overrides,
	};
	await apiPost("/v1/product", payload, token);
	const res = await apiGet(`/v1/products/slug/${slug}`);
	const found = res?.data as { id: number; slug: string } | null;
	if (!found) throw new Error(`seedProduct: could not find created product slug="${slug}"`);
	return found;
}

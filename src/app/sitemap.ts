import { MetadataRoute } from "next";
import { getData } from "@/services/services";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mahoura.com";

async function fetchProducts(): Promise<{ slug: string; updatedAt?: string }[]> {
	try {
		const data = await getData({ endPoint: "v1/products", params: { limit: 500 } });
		return data?.data?.products ?? [];
	} catch {
		return [];
	}
}

async function fetchCategories(): Promise<{ slug: string }[]> {
	try {
		const data = await getData({ endPoint: "v1/category" });
		return data?.data ?? [];
	} catch {
		return [];
	}
}

async function fetchBrands(): Promise<{ slug: string }[]> {
	try {
		const data = await getData({ endPoint: "v1/brand" });
		return data?.data ?? [];
	} catch {
		return [];
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [products, categories, brands] = await Promise.all([
		fetchProducts(),
		fetchCategories(),
		fetchBrands(),
	]);

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: `${SITE_URL}/`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${SITE_URL}/products`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${SITE_URL}/categories`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/brands`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${SITE_URL}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.4,
		},
	];

	const productRoutes: MetadataRoute.Sitemap = products
		.filter((p) => p.slug)
		.map((p) => ({
			url: `${SITE_URL}/products/${p.slug}`,
			lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		}));

	const categoryRoutes: MetadataRoute.Sitemap = categories
		.filter((c) => c.slug)
		.map((c) => ({
			url: `${SITE_URL}/categories/${c.slug}`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.7,
		}));

	const brandRoutes: MetadataRoute.Sitemap = brands
		.filter((b) => b.slug)
		.map((b) => ({
			url: `${SITE_URL}/brands/${b.slug}`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.7,
		}));

	return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...brandRoutes];
}

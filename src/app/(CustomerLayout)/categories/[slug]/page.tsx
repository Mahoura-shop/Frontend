import type { Metadata } from "next";
import CategoryDetailClient from "./CategoryDetailClient";
import { getData } from "@/services/services";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mahoura.com";

export const revalidate = 3600;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	try {
		const data = await getData({ endPoint: "v1/category" });
		const categories: { slug: string; name: string; description?: string }[] =
			data?.data ?? [];
		const category = categories.find((c) => c.slug === slug);

		if (!category) return { title: "دسته‌بندی" };

		const description =
			category.description ||
			`مشاهده محصولات دسته‌بندی ${category.name} در فروشگاه آرایشی ماهورا`;

		return {
			title: category.name,
			description,
			alternates: {
				canonical: `${SITE_URL}/categories/${slug}`,
			},
			openGraph: {
				title: category.name,
				description,
				type: "website",
				images: [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630 }],
			},
		};
	} catch {
		return { title: "دسته‌بندی" };
	}
}

export default async function CategoryDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	let categoryName = "";
	try {
		const data = await getData({ endPoint: "v1/category" });
		const categories: { slug: string; name: string }[] = data?.data ?? [];
		categoryName = categories.find((c) => c.slug === slug)?.name ?? "";
	} catch {}

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "خانه", item: `${SITE_URL}/` },
			{
				"@type": "ListItem",
				position: 2,
				name: "دسته‌بندی‌ها",
				item: `${SITE_URL}/categories`,
			},
			...(categoryName
				? [
						{
							"@type": "ListItem",
							position: 3,
							name: categoryName,
							item: `${SITE_URL}/categories/${slug}`,
						},
					]
				: []),
		],
	};

	return (
		<>
			<JsonLd data={breadcrumbJsonLd} />
			<CategoryDetailClient />
		</>
	);
}

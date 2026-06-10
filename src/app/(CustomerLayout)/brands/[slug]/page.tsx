import type { Metadata } from "next";
import BrandDetailClient from "./BrandDetailClient";
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
		const data = await getData({ endPoint: "v1/brand" });
		const brands: {
			slug: string;
			name: string;
			description?: string;
			brandPic?: string;
		}[] = data?.data ?? [];
		const brand = brands.find((b) => b.slug === slug);

		if (!brand) return { title: "برند" };

		const description =
			brand.description ||
			`مشاهده محصولات برند ${brand.name} در فروشگاه آرایشی ماهورا`;

		return {
			title: brand.name,
			description,
			alternates: {
				canonical: `${SITE_URL}/brands/${slug}`,
			},
			openGraph: {
				title: brand.name,
				description,
				images: brand.brandPic
					? [{ url: brand.brandPic }]
					: [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630 }],
				type: "website",
			},
		};
	} catch {
		return { title: "برند" };
	}
}

export default async function BrandDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	let brandName = "";
	try {
		const data = await getData({ endPoint: "v1/brand" });
		const brands: { slug: string; name: string }[] = data?.data ?? [];
		brandName = brands.find((b) => b.slug === slug)?.name ?? "";
	} catch {}

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "خانه", item: `${SITE_URL}/` },
			{
				"@type": "ListItem",
				position: 2,
				name: "برندها",
				item: `${SITE_URL}/brands`,
			},
			...(brandName
				? [
						{
							"@type": "ListItem",
							position: 3,
							name: brandName,
							item: `${SITE_URL}/brands/${slug}`,
						},
					]
				: []),
		],
	};

	return (
		<>
			<JsonLd data={breadcrumbJsonLd} />
			<BrandDetailClient />
		</>
	);
}

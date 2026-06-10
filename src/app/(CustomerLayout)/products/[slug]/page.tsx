import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
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
		const data = await getData({ endPoint: `v1/products/slug/${slug}` });
		const product = data?.data;

		if (!product) return { title: "محصول" };

		const description =
			product.description || `خرید ${product.name} از فروشگاه آرایشی ماهورا`;
		const imageUrl = product.productPic || product.images?.[0];

		return {
			title: product.name,
			description,
			alternates: {
				canonical: `${SITE_URL}/products/${slug}`,
			},
			openGraph: {
				title: product.name,
				description,
				images: imageUrl
					? [{ url: imageUrl, width: 800, height: 800 }]
					: [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630 }],
				type: "website",
			},
			twitter: {
				card: "summary_large_image",
				title: product.name,
				description,
				images: imageUrl ? [imageUrl] : [`${SITE_URL}/og-default.jpg`],
			},
		};
	} catch {
		return { title: "محصول" };
	}
}

export default async function ProductDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	let product: any = null;
	try {
		const data = await getData({ endPoint: `v1/products/slug/${slug}` });
		product = data?.data ?? null;
	} catch {}

	const productJsonLd = product
		? {
				"@context": "https://schema.org",
				"@type": "Product",
				name: product.name,
				description:
					product.description ||
					`خرید ${product.name} از فروشگاه آرایشی ماهورا`,
				image: product.productPic ? [product.productPic] : [],
				sku: String(product.id),
				brand: product.brand
					? { "@type": "Brand", name: product.brand.name }
					: undefined,
				offers: {
					"@type": "Offer",
					priceCurrency: "IRR",
					price: product.consumerPrice,
					availability:
						product.quantity > 0
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
					url: `${SITE_URL}/products/${slug}`,
				},
			}
		: null;

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "خانه", item: `${SITE_URL}/` },
			{
				"@type": "ListItem",
				position: 2,
				name: "محصولات",
				item: `${SITE_URL}/products`,
			},
			...(product
				? [
						{
							"@type": "ListItem",
							position: 3,
							name: product.name,
							item: `${SITE_URL}/products/${slug}`,
						},
					]
				: []),
		],
	};

	return (
		<>
			{productJsonLd && <JsonLd data={productJsonLd} />}
			<JsonLd data={breadcrumbJsonLd} />
			<ProductDetailClient initialProduct={product} />
		</>
	);
}

import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { getData } from "@/services/services";

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
		const image = product.productPic || product.images?.[0];

		return {
			title: product.name,
			description,
			openGraph: {
				title: product.name,
				description,
				images: image ? [{ url: image }] : [],
				type: "website",
			},
			twitter: {
				card: "summary_large_image",
				title: product.name,
				description,
				images: image ? [image] : [],
			},
		};
	} catch {
		return { title: "محصول" };
	}
}

export default function ProductDetailPage() {
	return <ProductDetailClient />;
}

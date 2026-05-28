import type { Metadata } from "next";
import BrandDetailClient from "./BrandDetailClient";
import { getData } from "@/services/services";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	try {
		const data = await getData({ endPoint: "v1/brand" });
		const brands: { slug: string; name: string; description?: string; brandPic?: string }[] =
			data?.data ?? [];
		const brand = brands.find((b) => b.slug === slug);

		if (!brand) return { title: "برند" };

		const description =
			brand.description ||
			`مشاهده محصولات برند ${brand.name} در فروشگاه آرایشی ماهورا`;

		return {
			title: brand.name,
			description,
			openGraph: {
				title: brand.name,
				description,
				images: brand.brandPic ? [{ url: brand.brandPic }] : [],
				type: "website",
			},
		};
	} catch {
		return { title: "برند" };
	}
}

export default function BrandDetailPage() {
	return <BrandDetailClient />;
}

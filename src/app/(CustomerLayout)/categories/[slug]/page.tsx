import type { Metadata } from "next";
import CategoryDetailClient from "./CategoryDetailClient";
import { getData } from "@/services/services";

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
			openGraph: {
				title: category.name,
				description,
				type: "website",
			},
		};
	} catch {
		return { title: "دسته‌بندی" };
	}
}

export default function CategoryDetailPage() {
	return <CategoryDetailClient />;
}

import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mahoura.com";

export const metadata: Metadata = {
	title: "محصولات",
	description:
		"خرید آنلاین انواع لوازم آرایشی و بهداشتی از برندهای معتبر. جستجو، فیلتر بر اساس دسته‌بندی، برند و قیمت.",
	alternates: {
		canonical: `${SITE_URL}/products`,
	},
	openGraph: {
		title: "محصولات | ماهورا",
		description:
			"خرید آنلاین انواع لوازم آرایشی و بهداشتی از برندهای معتبر در فروشگاه ماهورا.",
		type: "website",
	},
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

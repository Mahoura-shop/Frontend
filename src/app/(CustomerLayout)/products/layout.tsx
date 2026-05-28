import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "محصولات",
	description:
		"خرید آنلاین انواع لوازم آرایشی و بهداشتی از برندهای معتبر. جستجو، فیلتر بر اساس دسته‌بندی، برند و قیمت.",
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

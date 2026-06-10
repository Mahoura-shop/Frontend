import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mahoura.com";

export const metadata: Metadata = {
	title: "دسته‌بندی‌ها",
	description:
		"مشاهده تمام دسته‌بندی‌های محصولات آرایشی و بهداشتی در فروشگاه ماهورا.",
	alternates: {
		canonical: `${SITE_URL}/categories`,
	},
	openGraph: {
		title: "دسته‌بندی‌ها | ماهورا",
		description:
			"مشاهده تمام دسته‌بندی‌های محصولات آرایشی و بهداشتی در فروشگاه ماهورا.",
		type: "website",
	},
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

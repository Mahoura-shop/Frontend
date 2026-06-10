import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mahoura.com";

export const metadata: Metadata = {
	title: "درباره ماهورا",
	description:
		"ماهورا با هدف ارائه بهترین محصولات آرایشی و بهداشتی لوکس به بازار ایران فعالیت می‌کند. بیش از ۱۰ سال تجربه، بیش از ۱۰۰۰ مشتری راضی.",
	alternates: {
		canonical: `${SITE_URL}/about`,
	},
	openGraph: {
		title: "درباره ماهورا",
		description:
			"ماهورا با هدف ارائه بهترین محصولات آرایشی و بهداشتی لوکس به بازار ایران فعالیت می‌کند.",
		type: "website",
	},
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

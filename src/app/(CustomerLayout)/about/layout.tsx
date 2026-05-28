import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "درباره ماهورا",
	description:
		"ماهورا با هدف ارائه بهترین محصولات آرایشی و بهداشتی لوکس به بازار ایران فعالیت می‌کند. بیش از ۱۰ سال تجربه، بیش از ۱۰۰۰ مشتری راضی.",
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

import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mahoura.com";

export const metadata: Metadata = {
	title: "برندها",
	description:
		"مشاهده تمام برندهای معتبر آرایشی و بهداشتی موجود در فروشگاه ماهورا.",
	alternates: {
		canonical: `${SITE_URL}/brands`,
	},
	openGraph: {
		title: "برندها | ماهورا",
		description:
			"مشاهده تمام برندهای معتبر آرایشی و بهداشتی موجود در فروشگاه ماهورا.",
		type: "website",
	},
};

export default function BrandsLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

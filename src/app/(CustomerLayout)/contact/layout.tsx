import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mahoura.com";

export const metadata: Metadata = {
	title: "تماس با ماهورا",
	description:
		"با تیم پشتیبانی فروشگاه آرایشی ماهورا در ارتباط باشید. آماده پاسخگویی به سوالات و راهنمایی شما هستیم.",
	alternates: {
		canonical: `${SITE_URL}/contact`,
	},
	openGraph: {
		title: "تماس با ماهورا",
		description: "با تیم پشتیبانی فروشگاه آرایشی ماهورا در ارتباط باشید.",
		type: "website",
	},
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

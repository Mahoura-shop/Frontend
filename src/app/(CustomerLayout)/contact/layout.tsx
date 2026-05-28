import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "تماس با ماهورا",
	description:
		"با تیم پشتیبانی فروشگاه آرایشی ماهورا در ارتباط باشید. آماده پاسخگویی به سوالات و راهنمایی شما هستیم.",
	openGraph: {
		title: "تماس با ماهورا",
		description: "با تیم پشتیبانی فروشگاه آرایشی ماهورا در ارتباط باشید.",
		type: "website",
	},
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

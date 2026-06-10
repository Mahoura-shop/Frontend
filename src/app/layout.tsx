import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Vazirmatn } from "@/utils/fonts";
import { TooltipProvider } from "@/components/ui/tooltip";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mahoura.com";

export const metadata: Metadata = {
	title: {
		template: "%s | ماهورا",
		default: "ماهورا — فروشگاه آرایشی و بهداشتی",
	},
	description:
		"خرید آنلاین لوازم آرایشی و بهداشتی با بهترین کیفیت و قیمت از فروشگاه ماهورا. برندهای معتبر، ارسال سریع، تضمین اصالت کالا.",
	keywords: ["آرایشی", "بهداشتی", "لوازم آرایشی", "خرید آنلاین", "ماهورا", "پوست", "مو", "رژ لب", "کرم"],
	manifest: "/manifest.json",
	icons: {
		icon: "/icons/icon-192.png",
		apple: "/icons/icon-192.png",
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "ماهورا",
	},
	openGraph: {
		type: "website",
		locale: "fa_IR",
		siteName: "ماهورا",
		title: "ماهورا — فروشگاه آرایشی و بهداشتی",
		description:
			"خرید آنلاین لوازم آرایشی و بهداشتی با بهترین کیفیت و قیمت از فروشگاه ماهورا.",
		images: [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630, alt: "ماهورا" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "ماهورا — فروشگاه آرایشی و بهداشتی",
		description:
			"خرید آنلاین لوازم آرایشی و بهداشتی با بهترین کیفیت و قیمت از فروشگاه ماهورا.",
		images: [`${SITE_URL}/og-default.jpg`],
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport: Viewport = {
	themeColor: "#C8536A",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fa" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
			<body className={`${Vazirmatn.variable} antialiased no-scrollbar`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TooltipProvider>{children}</TooltipProvider>
					<Toaster richColors={true} position="bottom-right" swipeDirections={["left", "right"]} />
				</ThemeProvider>
			</body>
		</html>
	);
}

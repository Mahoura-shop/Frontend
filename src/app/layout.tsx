import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
	title: "ماهورا",
	description: "فروشگاه لوازم آرایشی و بهداشتی ماهورا",
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "ماهورا",
	},
};

export const viewport: Viewport = {
	themeColor: "#C8536A",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fa" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
			<body className="antialiased no-scrollbar">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TooltipProvider>{children}</TooltipProvider>
					<Toaster richColors={true} />
				</ThemeProvider>
			</body>
		</html>
	);
}

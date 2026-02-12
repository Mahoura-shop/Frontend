import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
	title: "Mahoura",
	description:
		"Luxury Persian Cosmetics & Beauty Products - محصولات آرایشی و بهداشتی لوکس",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fa" dir="rtl" suppressHydrationWarning>
			<body className="antialiased no-scrollbar">
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
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

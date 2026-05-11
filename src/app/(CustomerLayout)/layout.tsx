import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			<PageTransition>
				<div>{children}</div>
			</PageTransition>
			<Footer />
		</>
	);
}

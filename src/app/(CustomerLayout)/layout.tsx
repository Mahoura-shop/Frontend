import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			<div className="pt-[70px] pb-24 md:pb-0">{children}</div>
			<Footer />
		</>
	);
}

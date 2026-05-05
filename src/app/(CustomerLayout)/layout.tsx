import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			<div>{children}</div>
			{/* <div className="pt-[70px] pb-24 md:pb-0">{children}</div> */}
			<Footer />
		</>
	);
}

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import DashboardSidebar from "@/components/DashboardSidebar/DashboardSidebar";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			<DashboardSidebar />
			<PageTransition>
				<div className="md:pt-[90px]">{children}</div>
			</PageTransition>
			<Footer />
		</>
	);
}

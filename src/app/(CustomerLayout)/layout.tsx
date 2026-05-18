import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import DashboardSidebar from "@/components/DashboardSidebar/DashboardSidebar";
import PageWrapper from "@/components/PageWrapper/PageWrapper";

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
				<PageWrapper>{children}</PageWrapper>
			</PageTransition>
			<Footer />
		</>
	);
}

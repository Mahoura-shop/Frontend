import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import PageTransition from "@/components/PageTransition/PageTransition";
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
				{children}
				{/* <PageWrapper>{children}</PageWrapper> */}
			</PageTransition>
			<Footer />
		</>
	);
}

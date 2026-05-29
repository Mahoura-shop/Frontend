import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import PageTransition from "@/components/PageTransition/PageTransition";
import DashboardSidebar from "@/components/DashboardSidebar/DashboardSidebar";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import BackgroundPortraits from "@/components/BackgroundPortraits/BackgroundPortraits";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative">
			{/* <BackgroundPortraits mode="absolute" count={20} seed={3} /> */}
			<Navbar />
			<DashboardSidebar />
			<PageTransition>
				{children}
				{/* <PageWrapper>{children}</PageWrapper> */}
			</PageTransition>
			<Footer />
		</div>
	);
}

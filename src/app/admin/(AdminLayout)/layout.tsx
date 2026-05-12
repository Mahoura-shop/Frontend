"use client";

import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar/DashboardSidebar";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return (
		<AdminGuard>
			<div className="flex flex-col min-h-screen" dir="rtl">
				<Navbar />
				<DashboardSidebar />
				<div className="flex-1">
					{children}
				</div>
			</div>
		</AdminGuard>
	);
}

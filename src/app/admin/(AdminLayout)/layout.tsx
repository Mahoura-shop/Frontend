"use client";

import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar/DashboardSidebar";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";
import { useDashboardMenuStore } from "@/store/useDashboardMenuStore";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { sidebarOpen, setSidebarOpen } = useDashboardMenuStore();

	return (
		<AdminGuard>
			<div className="min-h-screen bg-background flex flex-col" dir="rtl">
				<Navbar />
				<DashboardSidebar />
				<AdminSidebar />

				{/* Desktop Header with Menu Toggle */}
				{/* <header className="hidden lg:sticky lg:top-20 lg:z-40 lg:block bg-card border-b border-border shadow-sm">
					<div className="px-6 py-4 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setSidebarOpen(!sidebarOpen)}
							>
								<Menu className="w-5 h-5" />
							</Button>
							<h1 className="text-xl font-bold">
								مدیریت فروشگاه
							</h1>
						</div>
					</div>
				</header> */}

				<div
					className="flex-1 transition-all duration-300 mt-20"
					style={{ marginRight: sidebarOpen ? "256px" : "0" }}
				>
					{children}
				</div>
			</div>
		</AdminGuard>
	);
}

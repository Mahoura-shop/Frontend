"use client";

import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar/DashboardSidebar";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";
import { useDashboardMenuStore } from "@/store/useDashboardMenuStore";

import {
	LogOut,
	Menu,
	Home,
	Package,
	DollarSign,
	FolderTree,
	Tag,
	ShoppingBag,
	Users,
	ClipboardList,
	Shield,
	Coins,
	RotateCcw,
	Settings,
	Mail,
	Warehouse,
} from "lucide-react";

const adminMenuItems = [
	{
		title: "داشبورد",
		href: "/admin/dashboard",
		icon: Home,
	},
	{
		title: "مدیریت محصولات",
		href: "/admin/products",
		icon: Package,
	},
	{
		title: "تغییر گروهی قیمت",
		href: "/admin/price-group",
		icon: DollarSign,
	},
	{
		title: "دسته‌بندی‌ها",
		href: "/admin/categories",
		icon: FolderTree,
	},
	{
		title: "برندها",
		href: "/admin/brands",
		icon: Tag,
	},
	{
		title: "سفارش‌ها",
		href: "/admin/orders",
		icon: ShoppingBag,
	},
	{
		title: "کاربران",
		href: "/admin/users",
		icon: Users,
	},
	{
		title: "نقش‌ها و دسترسی‌ها",
		href: "/admin/roles",
		icon: Shield,
	},
	{
		title: "مرجوعی‌ها",
		href: "/admin/returns",
		icon: RotateCcw,
	},
	{
		title: "موجودی",
		href: "/admin/inventory",
		icon: Warehouse,
	},
	{
		title: "پیام‌های تماس",
		href: "/admin/contacts",
		icon: Mail,
	},
	{
		title: "تنظیمات",
		href: "/admin/settings",
		icon: Settings,
	},
];

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
				<DashboardSidebar items={adminMenuItems} />
				<AdminSidebar items={adminMenuItems} />
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

"use client";

import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar/DashboardSidebar";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";
import { useDashboardMenuStore } from "@/store/useDashboardMenuStore";
import { Button } from "@/components/ui/button";
import {
	Home,
	Package,
	DollarSign,
	FolderTree,
	Tag,
	ShoppingBag,
	Users,
	Shield,
	RotateCcw,
	Settings,
	Mail,
	Warehouse,
	ScrollText,
	Menu,
} from "lucide-react";

const adminMenuItems = [
	{ title: "داشبورد", href: "/admin/dashboard", icon: Home },
	{ title: "مدیریت محصولات", href: "/admin/products", icon: Package, permission: "product:see" },
	{ title: "تغییر گروهی قیمت", href: "/admin/price-group", icon: DollarSign, permission: "product:batch_price" },
	{ title: "موجودی", href: "/admin/inventory", icon: Warehouse, permission: "product:batch_inventory" },
	{ title: "دسته‌بندی‌ها", href: "/admin/categories", icon: FolderTree, permission: "category:see" },
	{ title: "برندها", href: "/admin/brands", icon: Tag, permission: "brand:see" },
	{ title: "سفارش‌ها", href: "/admin/orders", icon: ShoppingBag, permission: "order:see" },
	{ title: "کاربران", href: "/admin/users", icon: Users, permission: "users:see" },
	{ title: "نقش‌ها و دسترسی‌ها", href: "/admin/roles", icon: Shield, permission: "rbac:see" },
	{ title: "مرجوعی‌ها", href: "/admin/returns", icon: RotateCcw },
	{ title: "پیام‌های تماس", href: "/admin/contacts", icon: Mail, permission: "contact:see" },
	{ title: "لاگ‌های ادمین", href: "/admin/admin-logs", icon: ScrollText, permission: "adminlogs:see" },
	{ title: "تنظیمات", href: "/admin/settings", icon: Settings, permission: "update:currencies" },
];

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { setSidebarOpen } = useDashboardMenuStore();

	return (
		<AdminGuard>
			<div className="min-h-screen bg-background" dir="rtl">
				<Navbar />
				<DashboardSidebar items={adminMenuItems} />
				<div className="container mx-auto px-4 pt-[90px] pb-8">
					<div className="grid lg:grid-cols-4 gap-6">
						<div className="lg:hidden">
							<Button
								variant="outline"
								className="w-full gap-2"
								onClick={() => setSidebarOpen(true)}
							>
								<Menu className="w-5 h-5" />
								منوی مدیریت
							</Button>
						</div>

						<aside className="hidden lg:block lg:col-span-1">
							<AdminSidebar items={adminMenuItems} />
						</aside>

						<div className="lg:col-span-3">
							{children}
						</div>
					</div>
				</div>
			</div>
		</AdminGuard>
	);
}

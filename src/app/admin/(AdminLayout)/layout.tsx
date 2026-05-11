"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import {
	Home,
	Package,
	FolderTree,
	Tag,
	Settings,
	LogOut,
	Menu,
	X,
	Sun,
	Moon,
	DollarSign,
	ShoppingBag,
	Users,
	ClipboardList,
	Shield,
	Coins,
	RotateCcw,
} from "lucide-react";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { usePathname, useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { theme, setTheme } = useTheme();

	useEffect(() => setMounted(true), []);

	const menuItems = [
		{
			id: "dashboard",
			label: "داشبورد",
			icon: Home,
			href: "/admin/dashboard",
			sub: false,
			count: null,
		},
		{
			id: "products",
			label: "مدیریت محصولات",
			icon: Package,
			href: "/admin/products",
			sub: false,
			count: 250,
		},
		{
			id: "productsGroup",
			label: "تغییر گروهی قیمت",
			icon: DollarSign,
			href: "/admin/products/group",
			sub: true,
			count: 250,
		},
		{
			id: "categories",
			label: "دسته‌بندی‌ها",
			icon: FolderTree,
			href: "/admin/categories",
			sub: false,
			count: 15,
		},
		{
			id: "brands",
			label: "برندها",
			icon: Tag,
			href: "/admin/brands",
			sub: false,
			count: 50,
		},
		{
			id: "orders",
			label: "سفارش‌ها",
			icon: ShoppingBag,
			href: "/admin/orders",
			sub: false,
			count: null,
		},
		{
			id: "users",
			label: "کاربران",
			icon: Users,
			href: "/admin/users",
			sub: false,
			count: null,
		},
		{
			id: "upgrade-requests",
			label: "درخواست‌های ارتقاء",
			icon: ClipboardList,
			href: "/admin/upgrade-requests",
			sub: false,
			count: null,
		},
		{
			id: "roles",
			label: "نقش‌ها و دسترسی‌ها",
			icon: Shield,
			href: "/admin/roles",
			sub: false,
			count: null,
		},
		{
			id: "currencies",
			label: "ارزها",
			icon: Coins,
			href: "/admin/currencies",
			sub: false,
			count: null,
		},
		{
			id: "returns",
			label: "مرجوعی‌ها",
			icon: RotateCcw,
			href: "/admin/returns",
			sub: false,
			count: null,
		},
		{
			id: "settings",
			label: "تنظیمات",
			icon: Settings,
			href: "/admin/settings",
			sub: false,
			count: null,
		},
	];

	const handleLogout = () => {
		router.push("/");
	};

	return (
		<AdminGuard>
		<div className="min-h-screen bg-background flex no-scrollbar" dir="rtl">
			{/* Sidebar - Fixed on the right */}
			<motion.aside
				initial={false}
				animate={{ width: sidebarOpen ? 256 : 0 }}
				transition={spring.default}
				className="fixed right-0 top-0 h-full bg-card border-l border-border overflow-hidden shadow-lg"
			>
				<div className="w-64 h-full flex flex-col">
					{/* Sidebar Header */}
					<div className="p-6 border-b border-border">
						<div className="flex items-center justify-between mb-2">
							<div className="flex w-full place-content-center">
								<Image
									src={logo}
									alt="Mahoura"
									className="w-32 h-32 dark:invert"
								/>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setSidebarOpen(false)}
								className="lg:hidden"
							>
								<X className="w-5 h-5" />
							</Button>
						</div>
						<p className="text-sm text-muted-foreground">
							پنل مدیریت
						</p>
					</div>

					{/* Navigation Menu */}
					<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
						{menuItems?.map((item, i) => {
							const isActive = pathname === item.href;
							return (
								<motion.div
									key={item.id}
									initial={{ opacity: 0, x: 50 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.1 }}
								>
									<Link href={item.href}>
										<button
											className={`${item.sub ? "px-8" : "px-4"} w-full flex items-center gap-3  py-3 rounded-lg transition-all ${
												isActive
													? "bg-gradient-to-r from-primary-rose to-secondary-plum text-white shadow-lg"
													: "hover:bg-muted"
											}`}
										>
											<item.icon className="w-5 h-5" />
											<span className="font-medium flex-1 text-right">
												{item.label}
											</span>
											{/* {item.count !== null && (
												<Badge
													variant="secondary"
													className="mr-auto"
												>
													{item.count}
												</Badge>
											)} */}
										</button>
									</Link>
								</motion.div>
							);
						})}
					</nav>

					{/* Sidebar Footer */}
					<div className="p-4 border-t border-border space-y-2">
						<Button
							variant="ghost"
							className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
							onClick={handleLogout}
						>
							<LogOut className="w-5 h-5" />
							خروج
						</Button>
					</div>
				</div>
			</motion.aside>

			{/* Main Content Area */}
			<div
				className="flex-1 transition-all duration-300"
				style={{ marginRight: sidebarOpen ? "256px" : "0" }}
			>
				{/* Top Header */}
				<header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
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

						<div className="flex items-center gap-2">
							{/* Theme Toggle */}
							<Button
								variant="ghost"
								size="icon"
								onClick={() =>
									setTheme(
										theme === "dark" ? "light" : "dark",
									)
								}
							>
								{mounted && theme === "dark" ? (
									<Sun className="w-5 h-5" />
								) : (
									<Moon className="w-5 h-5" />
								)}
							</Button>
						</div>
					</div>
				</header>

				{/* Page Content */}
				{children}
			</div>
		</div>
		</AdminGuard>
	);
}

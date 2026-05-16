"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
	LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useDashboardMenuStore } from "@/store/useDashboardMenuStore";
import useUserStore from "@/store/userStore/userStore";

interface Item {
	title: string;
	href: string;
	icon: LucideIcon
}

export default function AdminSidebar({items}: {items: Item[]}) {
	const pathname = usePathname();
	const { sidebarOpen, setSidebarOpen } = useDashboardMenuStore();
	const { logout } = useUserStore();

	const isActive = (href: string) => {
		if (href === "/admin/dashboard") {
			return pathname === href;
		}
		return pathname?.startsWith(href);
	};

	const handleLogout = () => {
		logout();
		setSidebarOpen(false);
	};

	return (
		<motion.aside
			initial={false}
			animate={{ width: sidebarOpen ? 256 : 0 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className="hidden lg:block fixed right-0 top-20 bg-card border-l border-border overflow-hidden shadow-lg"
			style={{ height: "calc(100vh - 80px)" }}
		>
			<div className="w-64 h-full flex flex-col">
				{/* Sidebar Header */}
				<div className="p-6 border-b border-border">
					<div className="flex items-center justify-center mb-2">
						<Image
							src={logo}
							alt="Mahoura"
							className="w-32 h-32 dark:invert"
						/>
					</div>
					<p className="text-sm text-muted-foreground text-center">
						پنل مدیریت
					</p>
				</div>

				{/* Navigation Menu */}
				<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
					{items.map((item, i) => {
						const active = isActive(item.href);
						return (
							<motion.div
								key={item.href}
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: i * 0.05 }}
							>
								<Link href={item.href}>
									<motion.button
										whileHover={{ x: -5 }}
										whileTap={{ scale: 0.98 }}
										className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
											active
												? "bg-gradient-to-r from-primary-rose to-secondary-plum text-white shadow-lg"
												: "hover:bg-muted"
										}`}
									>
										<item.icon className="w-5 h-5" />
										<span className="font-medium flex-1 text-right">
											{item.title}
										</span>
									</motion.button>
								</Link>
							</motion.div>
						);
					})}
				</nav>

				{/* Sidebar Footer */}
				<div className="p-4 border-t border-border">
					<motion.button
						whileHover={{ x: -5 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleLogout}
						className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
					>
						<LogOut className="w-5 h-5" />
						<span className="font-medium flex-1 text-right">
							خروج
						</span>
					</motion.button>
				</div>
			</div>
		</motion.aside>
	);
}

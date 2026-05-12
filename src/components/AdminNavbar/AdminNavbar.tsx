"use client";
import React from "react";

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
	Users,
	ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";
import Link from "next/link";

const menuItems = [
	{
		id: "dashboard",
		label: "داشبورد",
		icon: Home,
		href: "/admin/dashboard",
		count: null,
	},
	{
		id: "products",
		label: "محصولات",
		icon: Package,
		href: "/admin/products",
		count: 250,
	},
	{
		id: "categories",
		label: "دسته‌بندی‌ها",
		icon: FolderTree,
		href: "/admin/categories",
		count: 15,
	},
	{
		id: "brands",
		label: "برندها",
		icon: Tag,
		href: "/admin/brands",
		count: 50,
	},
	{
		id: "users",
		label: "کاربران",
		icon: Users,
		href: "/admin/users",
		count: null,
	},
	{
		id: "roles",
		label: "نقش‌ها",
		icon: ShieldCheck,
		href: "/admin/roles",
		count: null,
	},
	{
		id: "settings",
		label: "تنظیمات",
		icon: Settings,
		href: "/admin/settings",
		count: null,
	},
];

export default function AdminNavbar() {
	const pathname = usePathname();
	return (
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
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
									isActive
										? "bg-gradient-to-r from-primary-rose to-secondary-plum text-white shadow-lg"
										: "hover:bg-muted"
								}`}
							>
								<item.icon className="w-5 h-5" />
								<span className="font-medium flex-1 text-right">
									{item.label}
								</span>
								{item.count !== null && (
									<Badge
										variant="secondary"
										className="ms-auto"
									>
										{item.count}
									</Badge>
								)}
							</button>
						</Link>
					</motion.div>
				);
			})}
		</nav>
	);
}

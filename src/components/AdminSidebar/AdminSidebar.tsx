"use client";

import { motion } from "framer-motion";
import { LogOut, ChevronLeft, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDashboardMenuStore } from "@/store/useDashboardMenuStore";
import useUserStore from "@/store/useUserStore";

interface Item {
	title: string;
	href: string;
	icon: LucideIcon;
	permission?: string;
}

export default function AdminSidebar({ items }: { items: Item[] }) {
	const pathname = usePathname();
	const { logout, permissions, _hasHydrated } = useUserStore();
	const { setSidebarOpen } = useDashboardMenuStore();

	const isActive = (href: string) => {
		if (href === "/admin/dashboard") return pathname === href;
		return pathname?.startsWith(href);
	};

	const hasPermission = (item: Item) => {
		if (!item.permission) return true;
		if (!_hasHydrated) return true;
		if (!permissions || permissions.length === 0) return true;
		return permissions.includes(item.permission);
	};

	const handleLogout = () => {
		logout();
		setSidebarOpen(false);
	};

	return (
		<div className="sticky top-[90px] flex flex-col gap-4 max-h-[calc(100vh-106px)] overflow-y-auto no-scrollbar">
			<Card className="overflow-hidden">
				<div className="p-6 flex flex-col items-center gap-2">
					<Image src={logo} alt="Mahoura" className="w-20 h-20 dark:invert" />
					<Separator />
					<p className="text-sm text-muted-foreground">پنل مدیریت</p>
				</div>
			</Card>

			<Card className="p-2">
				<nav className="space-y-1">
					{items.map((item) => {
						const active = isActive(item.href);
						const allowed = hasPermission(item);
						const content = (
							<motion.div
								whileHover={allowed ? { x: -5, scale: 0.97 } : {}}
								whileTap={allowed ? { scale: 0.94 } : {}}
								className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
									!allowed
										? "opacity-40 cursor-not-allowed"
										: active
										? "bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/5 text-primary-rose font-semibold"
										: "hover:bg-muted/50"
								}`}
							>
								<div className="flex items-center gap-3">
									<item.icon
										className={`w-5 h-5 ${
											active ? "text-primary-rose" : "text-muted-foreground"
										}`}
									/>
									<span className="text-sm">{item.title}</span>
								</div>
								{active && <ChevronLeft className="w-4 h-4" />}
							</motion.div>
						);
						return allowed ? (
							<Link key={item.href} href={item.href}>
								{content}
							</Link>
						) : (
							<div key={item.href} title="دسترسی لازم را ندارید">
								{content}
							</div>
						);
					})}
				</nav>
			</Card>

			<Card className="p-2">
				<motion.button
					whileHover={{ x: -5 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleLogout}
					className="w-full text-right flex items-center gap-3 p-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
				>
					<LogOut className="w-5 h-5 text-destructive" />
					<span className="text-sm">خروج</span>
				</motion.button>
			</Card>
		</div>
	);
}

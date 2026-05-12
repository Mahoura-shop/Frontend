"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	User,
	ShoppingBag,
	Heart,
	MapPin,
	Wallet,
	Bell,
	Settings,
	LogOut,
	X,
	ChevronLeft,
	MessageSquare,
	Star,
	Home,
	RotateCcw,
	ArrowRightLeft,
	Moon,
	Sun,
	Package,
	FolderTree,
	Tag,
	DollarSign,
	Users,
	ClipboardList,
	Shield,
	Coins,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getMyProfile } from "@/services/userService";
import { useDashboardMenuStore } from "@/store/useDashboardMenuStore";
import useUserStore from "@/store/userStore/userStore";

interface Profile {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	type: string;
}

export default function DashboardSidebar() {
	const [profile, setProfile] = useState<Profile | null>(null);
	const pathname = usePathname();
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const { sidebarOpen, setSidebarOpen, isAdminView, toggleAdminView } =
		useDashboardMenuStore();
	const { isAdmin, logout } = useUserStore();

	useEffect(() => {
		getMyProfile()
			.then((res) => setProfile(res?.data ?? null))
			.catch(() => {});
	}, []);

	const navigationItems = [
		{
			title: "داشبورد",
			href: "/dashboard",
			icon: Home,
			badge: null,
		},
		{
			title: "سفارش‌های من",
			href: "/dashboard/orders",
			icon: ShoppingBag,
			badge: null,
		},
		{
			title: "علاقه‌مندی‌ها",
			href: "/dashboard/wishlist",
			icon: Heart,
			badge: null,
		},
		{
			title: "آدرس‌های من",
			href: "/dashboard/addresses",
			icon: MapPin,
			badge: null,
		},
		{
			title: "کیف پول",
			href: "/dashboard/wallet",
			icon: Wallet,
			badge: null,
		},
		{
			title: "مرجوعی‌ها",
			href: "/dashboard/returns",
			icon: RotateCcw,
			badge: null,
		},
		{
			title: "نظرات من",
			href: "/dashboard/reviews",
			icon: MessageSquare,
			badge: null,
		},
		{
			title: "اعلان‌ها",
			href: "/dashboard/notifications",
			icon: Bell,
			badge: null,
		},
	];

	const bottomNavigationItems = [
		{
			title: "تنظیمات حساب",
			href: "/dashboard/settings",
			icon: Settings,
		},
		{
			title: "خروج از حساب",
			href: "/logout",
			icon: LogOut,
		},
	];

	const adminNavigationItems = [
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
			href: "/admin/products/group",
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
			title: "درخواست‌های ارتقاء",
			href: "/admin/upgrade-requests",
			icon: ClipboardList,
		},
		{
			title: "نقش‌ها و دسترسی‌ها",
			href: "/admin/roles",
			icon: Shield,
		},
		{
			title: "ارزها",
			href: "/admin/currencies",
			icon: Coins,
		},
		{
			title: "مرجوعی‌ها",
			href: "/admin/returns",
			icon: RotateCcw,
		},
		{
			title: "تنظیمات",
			href: "/admin/settings",
			icon: Settings,
		},
	];

	const isActive = (href: string) => {
		if (href === "/dashboard") {
			return pathname === href;
		}
		return pathname?.startsWith(href);
	};

	const handleLogout = () => {
		logout();
		setSidebarOpen(false);
		router.push("/");
	};

	const handleAdminViewToggle = () => {
		toggleAdminView();
		if (!isAdminView) {
			setSidebarOpen(false);
			router.push("/admin/dashboard");
		}
	};

	return (
		<AnimatePresence>
			{sidebarOpen && (
				<>
					{/* Mobile Overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
						onClick={() => setSidebarOpen(false)}
					/>

					{/* Sidebar Content */}
					<motion.aside
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
						className="fixed right-0 top-0 h-screen z-50 md:hidden w-80"
					>
						<div className="h-full overflow-y-auto bg-background p-4 flex flex-col gap-4">
							{/* Close Button */}
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-bold">
									منوی داشبورد
								</h2>
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={() =>
											setTheme(
												theme === "dark"
													? "light"
													: "dark",
											)
										}
										className="rounded-full"
									>
										<AnimatePresence mode="wait">
											{theme === "dark" ? (
												<motion.div
													key="sun"
													initial={{
														rotate: -90,
														opacity: 0,
													}}
													animate={{
														rotate: 0,
														opacity: 1,
													}}
													exit={{
														rotate: 90,
														opacity: 0,
													}}
													transition={{
														duration: 0.2,
													}}
												>
													<Sun className="w-5 h-5" />
												</motion.div>
											) : (
												<motion.div
													key="moon"
													initial={{
														rotate: 90,
														opacity: 0,
													}}
													animate={{
														rotate: 0,
														opacity: 1,
													}}
													exit={{
														rotate: -90,
														opacity: 0,
													}}
													transition={{
														duration: 0.2,
													}}
												>
													<Moon className="w-5 h-5" />
												</motion.div>
											)}
										</AnimatePresence>
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setSidebarOpen(false)}
									>
										<X className="w-5 h-5" />
									</Button>
								</div>
							</div>

							{/* User Profile Card */}
							<Card className="overflow-hidden">
								<div className="relative h-20 bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20" />
								<div className="relative px-6 pb-6">
									<div className="absolute -top-10 right-6">
										<div className="w-20 h-20 rounded-full border-4 border-background bg-gradient-to-br from-primary-rose to-secondary-plum flex items-center justify-center overflow-hidden">
											<User className="w-9 h-9 text-white" />
										</div>
									</div>
									<div className="pt-12 space-y-2">
										<div>
											<h3 className="text-base font-bold leading-tight">
												{profile
													? [
															profile.firstName,
															profile.lastName,
														]
														.filter(Boolean)
														.join(" ") ||
													  "بدون نام"
													: "در حال بارگذاری..."}
											</h3>
											<p className="text-sm text-muted-foreground truncate">
												{profile?.email || ""}
											</p>
										</div>
										<Separator />
										<p className="text-xs text-muted-foreground">
											{profile?.phone && (
												<span dir="ltr">
													{profile.phone}
												</span>
											)}
										</p>
									</div>
								</div>
							</Card>

							{/* Admin View Toggle */}
							{isAdmin && (
								<Card className="p-3 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
									<button
										onClick={handleAdminViewToggle}
										className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-right"
									>
										<div className="flex items-center gap-2">
											<ArrowRightLeft className="w-4 h-4 text-amber-600 dark:text-amber-400" />
											<span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
												{isAdminView
													? "عودت به حساب"
													: "رفتن به پنل مدیریت"}
											</span>
										</div>
									</button>
								</Card>
							)}

							{/* Navigation Menu */}
							<Card className="p-2">
								<nav className="space-y-1">
									{(isAdminView
										? adminNavigationItems
										: navigationItems
									).map((item) => (
										<Link
											key={item.href}
											href={item.href}
											onClick={() =>
												setSidebarOpen(false)
											}
										>
											<motion.div
												whileHover={{
													x: -5,
													scale: 0.97,
												}}
												whileTap={{
													scale: 0.94,
												}}
												className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
													isActive(item.href)
														? "bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/5 text-primary-rose font-semibold"
														: "hover:bg-muted/50"
												}`}
											>
												<div className="flex items-center gap-3">
													<item.icon
														className={`w-5 h-5 ${
															isActive(
																item.href
															)
																? "text-primary-rose"
																: "text-muted-foreground"
														}`}
													/>
													<span className="text-sm">
														{item.title}
													</span>
												</div>
												<div className="flex items-center gap-2">
													{"badge" in item &&
														item.badge !==
														null && (
														<Badge
															variant={
																isActive(
																	item.href
																)
																	? "default"
																	: "secondary"
															}
															className="text-xs"
														>
															{new Intl.NumberFormat(
																"fa-IR"
															).format(
																item.badge
															)}
														</Badge>
													)}
													{isActive(
														item.href
													) && (
														<ChevronLeft className="w-4 h-4" />
													)}
												</div>
											</motion.div>
										</Link>
									))}
								</nav>
							</Card>

							{/* Bottom Actions */}
							<Card className="p-2">
								<nav className="space-y-1">
									{bottomNavigationItems.map((item) => {
										const isLogout =
											item.href === "/logout";
										return (
											<div
												key={item.href}
												onClick={() => {
													if (isLogout) {
														handleLogout();
													} else {
														setSidebarOpen(false);
													}
												}}
											>
												{!isLogout ? (
													<Link href={item.href}>
														<motion.div
															whileHover={{
																x: -5,
															}}
															whileTap={{
																scale: 0.98,
															}}
															className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
																isActive(
																	item.href
																)
																	? "bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/5 text-primary-rose font-semibold"
																	: "hover:bg-muted/50"
															}`}
														>
															<item.icon
																className={`w-5 h-5 ${
																	isActive(
																		item.href
																	)
																		? "text-primary-rose"
																		: "text-muted-foreground"
																}`}
															/>
															<span className="text-sm">
																{item.title}
															</span>
														</motion.div>
													</Link>
												) : (
													<motion.button
														whileHover={{
															x: -5,
														}}
														whileTap={{
															scale: 0.98,
														}}
														className="w-full text-right flex items-center gap-3 p-3 rounded-lg transition-colors text-destructive hover:bg-destructive/10"
													>
														<item.icon className="w-5 h-5 text-destructive" />
														<span className="text-sm">
															{item.title}
														</span>
													</motion.button>
												)}
											</div>
										);
									})}
								</nav>
							</Card>

							{/* Membership Info */}
							<Card className="p-4 bg-gradient-to-br from-primary-rose/5 via-accent-gold/5 to-secondary-plum/5">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-rose to-accent-gold flex items-center justify-center">
										<Star className="w-5 h-5 text-white" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-semibold">
											عضویت از
										</p>
										<p
											className="text-xs text-muted-foreground"
											dir="ltr"
										>
											{profile?.phone ?? "—"}
										</p>
									</div>
								</div>
							</Card>
						</div>
					</motion.aside>
				</>
			)}
		</AnimatePresence>
	);
}

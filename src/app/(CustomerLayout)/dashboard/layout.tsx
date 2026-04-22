// src/app/dashboard/layout.tsx
"use client";

import { useState, ReactNode } from "react";
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
	Menu,
	X,
	ChevronLeft,
	Package,
	CreditCard,
	Gift,
	MessageSquare,
	Star,
	Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock user data
const MOCK_USER = {
	name: "سارا احمدی",
	email: "sara.ahmadi@example.com",
	avatar: "https://ui-avatars.com/api/?name=Sara+Ahmadi&background=D4A5A5&color=fff&size=200",
	memberSince: "۱۴۰۲/۰۵/۱۵",
	totalOrders: 12,
	totalSpent: 15420000,
	loyaltyPoints: 2500,
	notifications: 3,
};

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();

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
			badge: MOCK_USER.totalOrders,
		},
		{
			title: "علاقه‌مندی‌ها",
			href: "/dashboard/wishlist",
			icon: Heart,
			badge: 5,
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
			title: "کارت‌های بانکی",
			href: "/dashboard/cards",
			icon: CreditCard,
			badge: null,
		},
		{
			title: "امتیازات و پاداش",
			href: "/dashboard/rewards",
			icon: Gift,
			badge: MOCK_USER.loyaltyPoints,
		},
		{
			title: "نظرات من",
			href: "/dashboard/reviews",
			icon: Star,
			badge: null,
		},
		{
			title: "پیام‌ها",
			href: "/dashboard/messages",
			icon: MessageSquare,
			badge: 2,
		},
		{
			title: "اعلان‌ها",
			href: "/dashboard/notifications",
			icon: Bell,
			badge: MOCK_USER.notifications,
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

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("fa-IR").format(price);
	};

	const isActive = (href: string) => {
		if (href === "/dashboard") {
			return pathname === href;
		}
		return pathname?.startsWith(href);
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<div className="container mx-auto px-4 py-8">
				<div className="grid lg:grid-cols-4 gap-6">
					{/* Mobile Sidebar Toggle */}
					<div className="lg:hidden">
						<Button
							variant="outline"
							className="w-full gap-2"
							onClick={() => setSidebarOpen(true)}
						>
							<Menu className="w-5 h-5" />
							منوی داشبورد
						</Button>
					</div>

					{/* Sidebar */}
					<AnimatePresence>
						{(sidebarOpen ||
							(typeof window !== "undefined" &&
								window.innerWidth >= 1024)) && (
							<>
								{/* Mobile Overlay */}
								{sidebarOpen && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
										onClick={() => setSidebarOpen(false)}
									/>
								)}

								{/* Sidebar Content */}
								<motion.aside
									initial={{
										x:
											typeof window !== "undefined" &&
											window.innerWidth < 1024
												? "100%"
												: 0,
									}}
									animate={{ x: 0 }}
									exit={{ x: "100%" }}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30,
									}}
									className="lg:col-span-1 fixed lg:sticky top-0 right-0 h-screen lg:h-auto lg:top-24 z-50 lg:z-0 w-80 lg:w-auto"
								>
									<div className="h-full overflow-y-auto bg-background lg:bg-transparent p-4 lg:p-0 space-y-4">
										{/* Close Button (Mobile) */}
										<div className="lg:hidden flex items-center justify-between mb-4">
											<h2 className="text-xl font-bold">
												منوی داشبورد
											</h2>
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													setSidebarOpen(false)
												}
											>
												<X className="w-5 h-5" />
											</Button>
										</div>

										{/* User Profile Card */}
										<Card className="overflow-hidden">
											<div className="relative h-24 bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20" />
											<div className="relative px-6 pb-6">
												<div className="absolute -top-12 right-6">
													<div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden">
														<img
															src={
																MOCK_USER.avatar
															}
															alt={MOCK_USER.name}
															className="w-full h-full object-cover"
														/>
													</div>
												</div>
												<div className="pt-14 space-y-3">
													<div>
														<h3 className="text-lg font-bold">
															{MOCK_USER.name}
														</h3>
														<p className="text-sm text-muted-foreground">
															{MOCK_USER.email}
														</p>
													</div>

													<Separator />

													<div className="grid grid-cols-2 gap-3 text-center">
														<div>
															<p className="text-2xl font-bold gradient-text">
																{
																	MOCK_USER.totalOrders
																}
															</p>
															<p className="text-xs text-muted-foreground">
																سفارش
															</p>
														</div>
														<div>
															<p className="text-2xl font-bold gradient-text">
																{
																	MOCK_USER.loyaltyPoints
																}
															</p>
															<p className="text-xs text-muted-foreground">
																امتیاز
															</p>
														</div>
													</div>
												</div>
											</div>
										</Card>

										{/* Navigation Menu */}
										<Card className="p-2">
											<nav className="space-y-1">
												{navigationItems.map((item) => (
													<Link
														key={item.href}
														href={item.href}
														onClick={() =>
															setSidebarOpen(
																false,
															)
														}
													>
														<motion.div
															whileHover={{
																x: -5,
															}}
															whileTap={{
																scale: 0.98,
															}}
															className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
																isActive(
																	item.href,
																)
																	? "bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/5 text-primary-rose font-semibold"
																	: "hover:bg-muted/50"
															}`}
														>
															<div className="flex items-center gap-3">
																<item.icon
																	className={`w-5 h-5 ${
																		isActive(
																			item.href,
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
																{item.badge !==
																	null && (
																	<Badge
																		variant={
																			isActive(
																				item.href,
																			)
																				? "default"
																				: "secondary"
																		}
																		className="text-xs"
																	>
																		{new Intl.NumberFormat(
																			"fa-IR",
																		).format(
																			item.badge,
																		)}
																	</Badge>
																)}
																{isActive(
																	item.href,
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
												{bottomNavigationItems.map(
													(item) => (
														<Link
															key={item.href}
															href={item.href}
															onClick={() =>
																setSidebarOpen(
																	false,
																)
															}
														>
															<motion.div
																whileHover={{
																	x: -5,
																}}
																whileTap={{
																	scale: 0.98,
																}}
																className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
																	item.href ===
																	"/logout"
																		? "text-destructive hover:bg-destructive/10"
																		: isActive(
																					item.href,
																			  )
																			? "bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/5 text-primary-rose font-semibold"
																			: "hover:bg-muted/50"
																}`}
															>
																<item.icon
																	className={`w-5 h-5 ${
																		item.href ===
																		"/logout"
																			? "text-destructive"
																			: isActive(
																						item.href,
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
													),
												)}
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
													<p className="text-xs text-muted-foreground">
														{MOCK_USER.memberSince}
													</p>
												</div>
											</div>
										</Card>
									</div>
								</motion.aside>
							</>
						)}
					</AnimatePresence>

					{/* Main Content */}
					<div className="lg:col-span-3">
						<motion.div
							key={pathname}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							{children}
						</motion.div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}

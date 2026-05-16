// src/app/dashboard/layout.tsx
"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
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
	ChevronLeft,
	MessageSquare,
	Star,
	Home,
	RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getMyProfile } from "@/services/userService";
import AuthGuard from "@/components/AuthGuard";
import { useDashboardMenuStore } from "@/store/useDashboardMenuStore";

interface Profile {
	firstName: string
	lastName: string
	phone: string
	email: string
	type: string
}

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const [profile, setProfile] = useState<Profile | null>(null);
	const pathname = usePathname();
	const { setSidebarOpen } = useDashboardMenuStore();

	useEffect(() => {
		getMyProfile()
			.then((res) => setProfile(res?.data ?? null))
			.catch(() => {})
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

	const isActive = (href: string) => {
		if (href === "/dashboard") {
			return pathname === href;
		}
		return pathname?.startsWith(href);
	};

	return (
		<AuthGuard>
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 pt-4 pb-8">
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

						{/* Desktop Sidebar */}
						<aside className="hidden lg:block lg:col-span-1">
							<div className="sticky top-24 flex flex-col gap-4">
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
														? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "بدون نام"
														: "در حال بارگذاری..."}
												</h3>
												<p className="text-sm text-muted-foreground truncate">
													{profile?.email || ""}
												</p>
											</div>
											<Separator />
											<p className="text-xs text-muted-foreground">
												{profile?.phone && <span dir="ltr">{profile.phone}</span>}
											</p>
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
											<p className="text-xs text-muted-foreground" dir="ltr">
												{profile?.phone ?? "—"}
											</p>
										</div>
									</div>
								</Card>
							</div>
						</aside>

						{/* Main Content */}
						<div className="lg:col-span-3">
							{children}
						</div>
					</div>
				</div>
			</div>
		</AuthGuard>
	);
}

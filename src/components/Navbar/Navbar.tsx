"use client";

import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Moon,
	Sun,
	Home,
	ShoppingBag,
	User,
	ShoppingCart,
	LogOut,
	LayoutDashboard,
	Bell,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useCartStore } from "@/store/useCartStore";
import useUserStore from "@/store/useUserStore";
import { notificationService } from "@/services/notificationService";
import { useNotificationStore } from "@/store/useNotificationStore";
import { formatDate } from "@/utils/formatDate";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Magnet from "../utils/Magnet";
import CartSheet from "@/components/CartSheet/CartSheet";
import { spring } from "@/lib/motion";
import GlassSurface from "../ReactBits/GlassSurface/GlassSurface";
import { useDashboardMenuStore } from "@/store/useDashboardMenuStore";

const menuItems = [
	{ label: "محصولات", href: "/products" },
	{ label: "برندها", href: "/brands" },
	{ label: "دسته‌بندی‌ها", href: "/categories" },
	{ label: "درباره ما", href: "/about" },
	{ label: "تماس با ما", href: "/contact" },
];

const bottomNavItems = [
	{ label: "خانه", icon: Home, href: "/" },
	{ label: "محصولات", icon: ShoppingBag, href: "/products" },
	{ label: "سبد خرید", icon: ShoppingCart, href: "/cart" },
	{ label: "حساب من", icon: User, href: "/dashboard" },
];

export default function Navbar() {
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();
	const router = useRouter();
	const { accessToken, firstName, lastName, isAdmin, logout } =
		useUserStore();
	const { fetchCart, getItemCount } = useCartStore();
	const { setSidebarOpen } = useDashboardMenuStore();
	const {
		unreadCount,
		recentNotifications,
		initialize,
		addNotification,
		markAsRead,
		markAllAsRead,
		reset,
	} = useNotificationStore();
	const itemCount = getItemCount();
	const [scrolled, setScrolled] = useState(false);
	const [cartSheetOpen, setCartSheetOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (accessToken) {
			fetchCart();
			initialize();
			const es = notificationService.createSSEConnection(
				accessToken,
				addNotification,
			);
			return () => es.close();
		} else {
			reset();
		}
	}, [accessToken]);

	const handleLogout = () => {
		reset();
		logout();
		router.push("/");
	};

	const isActive = (href: string) => {
		if (href === "/") return pathname === href;
		return pathname?.startsWith(href);
	};

	return (
		<>
			<GlassSurface
				displace={0.5}
				opacity={0.9}
				borderRadius={50}
				distortionScale={-180}
				redOffset={20}
				greenOffset={20}
				blueOffset={20}
				// blur={10}
				// brightness={80}
				mixBlendMode="color"
				width="calc(100% - 40px)"
				height={70}
				className={`${styles.nav}`}
			>
				<div className={styles.navContent}>
					<div className="flex items-center justify-between">
						<Link href="/" className="min-w-48">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-3 cursor-pointer"
							>
								<Image
									src={logo}
									alt="Mahoura"
									className="w-11 h-11 dark:invert"
									loading="eager"
								/>
							</motion.div>
						</Link>

						<div className="flex items-center gap-8">
							{menuItems.map((item, i) => (
								<Link
									key={item.href}
									href={item.href}
									className={`relative text-sm font-medium transition-colors group ${
										pathname === item.href
											? "text-primary-rose"
											: "text-foreground hover:text-primary-rose"
									}`}
								>
									{item.label}
									<span
										className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-rose to-accent-gold transition-all duration-300 ${
											pathname === item.href
												? "w-full"
												: "w-0 group-hover:w-full"
										}`}
									/>
								</Link>
							))}
						</div>

						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.4 }}
							className="flex items-center gap-3 min-w-48"
						>
							<Button
								variant="ghost"
								size="icon"
								onClick={() =>
									setTheme(
										theme === "dark" ? "light" : "dark",
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
											animate={{ rotate: 0, opacity: 1 }}
											exit={{ rotate: 90, opacity: 0 }}
											transition={{ duration: 0.2 }}
										>
											<Sun className="w-5 h-5" />
										</motion.div>
									) : (
										<motion.div
											key="moon"
											initial={{ rotate: 90, opacity: 0 }}
											animate={{ rotate: 0, opacity: 1 }}
											exit={{ rotate: -90, opacity: 0 }}
											transition={{ duration: 0.2 }}
										>
											<Moon className="w-5 h-5" />
										</motion.div>
									)}
								</AnimatePresence>
							</Button>

							{accessToken && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="rounded-full relative"
										>
											<Bell className="w-5 h-5" />
											{unreadCount > 0 && (
												<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-rose text-white text-[10px] font-bold flex items-center justify-center leading-none">
													{unreadCount > 99
														? "99+"
														: unreadCount}
												</span>
											)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										sideOffset={20}
										align="center"
										className="w-80 p-0"
									>
										<div className="flex items-center justify-between px-4 py-3 border-b">
											<span className="text-sm font-semibold">
												اعلان‌ها
											</span>
											<div className="flex items-center gap-2">
												{unreadCount > 0 && (
													<Badge
														variant="destructive"
														className="text-[10px] px-1.5 py-0"
													>
														{unreadCount} جدید
													</Badge>
												)}
												{unreadCount > 0 && (
													<button
														onClick={() =>
															markAllAsRead()
														}
														className="text-xs text-muted-foreground hover:text-primary-rose transition-colors"
													>
														همه خوانده شد
													</button>
												)}
											</div>
										</div>

										{recentNotifications.length === 0 ? (
											<div className="py-8 text-center text-sm text-muted-foreground">
												اعلانی وجود ندارد
											</div>
										) : (
											<div className="max-h-72 overflow-y-auto divide-y">
												{recentNotifications
													.slice(0, 5)
													.map((n) => (
														<div
															key={n.id}
															onClick={() =>
																!n.isRead &&
																markAsRead(n.id)
															}
															className={`flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${!n.isRead ? "cursor-pointer bg-primary-rose/5" : ""}`}
														>
															<div className="flex-shrink-0 mt-0.5">
																{!n.isRead && (
																	<span className="w-2 h-2 rounded-full bg-primary-rose block mt-1" />
																)}
																{n.isRead && (
																	<span className="w-2 h-2 rounded-full bg-transparent block mt-1" />
																)}
															</div>
															<div className="flex-1 min-w-0 text-right">
																<p className="text-sm font-medium leading-snug">
																	{n.title}
																</p>
																<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
																	{n.body}
																</p>
																<p className="text-[10px] text-muted-foreground mt-1">
																	{formatDate(
																		n.createdAt,
																	)}
																</p>
															</div>
														</div>
													))}
											</div>
										)}

										<div className="border-t px-4 py-2.5">
											<Link
												href="/dashboard/notifications"
												className="block text-center text-xs text-primary-rose hover:underline"
											>
												مشاهده همه اعلان‌ها
											</Link>
										</div>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
							{accessToken && (
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full"
								>
									<Link
										href="/cart"
										className="flex items-center justify-end gap-2 cursor-pointer"
									>
										<ShoppingCart className="w-4 h-4" />
									</Link>
								</Button>
							)}

							{!accessToken ? (
								<Magnet padding={5}>
									<Link href="/signin">
										<Button
											className={`bg-accent-gold hover:bg-accent-gold rounded-full hover:opacity-90 transition-opacity ${styles.navbarCta}`}
										>
											ورود / ثبت‌نام
										</Button>
									</Link>
								</Magnet>
							) : (
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.5 }}
								>
									<DropdownMenu>
										<DropdownMenuTrigger
											asChild
											data-testid="navbar-profile"
										>
											<button className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary-plum to-primary-rose flex items-center justify-center text-white hover:shadow-lg transition-shadow">
												<User className="w-5 h-5" />
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											sideOffset={20}
											align="center"
											className="w-48"
										>
											<DropdownMenuLabel className="text-right">
												{firstName || lastName
													? `${firstName} ${lastName}`.trim()
													: "بی نام"}
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											{isAdmin && (
												<DropdownMenuItem asChild>
													<Link
														href="/admin/dashboard"
														className="flex items-center justify-end gap-2 cursor-pointer"
													>
														<p>پنل مدیریت</p>
														<LayoutDashboard className="w-4 h-4" />
													</Link>
												</DropdownMenuItem>
											)}
											<DropdownMenuItem asChild>
												<Link
													href="/dashboard"
													className="flex items-center justify-end gap-2 cursor-pointer"
												>
													<p>حساب من</p>
													<User className="w-4 h-4" />
												</Link>
											</DropdownMenuItem>
											{/* <DropdownMenuItem asChild>
												<Link
													href="/cart"
													className="flex items-center justify-end gap-2 cursor-pointer"
												>
													<p>سبد خرید</p>
													<ShoppingCart className="w-4 h-4" />
												</Link>
											</DropdownMenuItem> */}
											<DropdownMenuSeparator />
											<DropdownMenuItem
												data-testid="logout"
												onClick={handleLogout}
												className="text-red-500 cursor-pointer focus:text-red-600 focus:bg-destructive/10 flex justify-end items-center gap-2"
											>
												<p>خروج</p>
												<LogOut className="w-4 h-4" />
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</motion.div>
							)}
						</motion.div>
					</div>
				</div>
			</GlassSurface>
			<BottomNav
				isActive={isActive}
				cartCount={itemCount}
				onCartOpen={() => setCartSheetOpen(true)}
				isLoggedIn={!!accessToken}
				firstName={firstName}
				lastName={lastName}
				isAdmin={isAdmin}
				onLogout={handleLogout}
				onAccountClick={() => setSidebarOpen(true)}
			/>
			<CartSheet
				open={cartSheetOpen}
				onClose={() => setCartSheetOpen(false)}
			/>
		</>
	);
}

function BottomNav({
	isActive,
	cartCount,
	onCartOpen,
	isLoggedIn,
	firstName,
	lastName,
	isAdmin,
	onLogout,
	onAccountClick,
}: {
	isActive: (href: string) => boolean;
	cartCount: number;
	onCartOpen: () => void;
	isLoggedIn: boolean;
	firstName?: string;
	lastName?: string;
	isAdmin?: boolean;
	onLogout: () => void;
	onAccountClick: () => void;
}) {
	return (
		<motion.nav
			initial={{ y: 100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ ...spring.bottomNav, delay: 0.1 }}
			className="fixed bottom-0 inset-x-0 z-50 md:hidden px-3 pb-3"
			style={{
				paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)",
			}}
		>
			<div
				className="w-full rounded-2xl shadow-2xl shadow-black/20"
				style={{
					background: "hsl(var(--background) / 0.78)",
					backdropFilter: "blur(28px) saturate(200%)",
					WebkitBackdropFilter: "blur(28px) saturate(200%)",
					border: "1px solid hsl(var(--border) / 0.4)",
					boxShadow:
						"0 8px 32px hsl(var(--foreground) / 0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
				}}
			>
				<div className="flex items-center justify-around px-2 py-2">
					{bottomNavItems.map((item) => {
						const isAccount = item.href === "/dashboard";
						const href =
							isAccount && !isLoggedIn ? "/signin" : item.href;
						const active = isActive(href);
						const isCart = item.href === "/cart";

						const inner = (
							<div className="relative flex flex-col items-center justify-center py-1">
								{active && (
									<motion.div
										layoutId="bottom-nav-pill"
										className="absolute inset-0 bg-gradient-to-br from-primary-rose/20 via-accent-gold/10 to-secondary-plum/10 rounded-xl"
										transition={spring.snappy}
									/>
								)}
								<motion.div
									animate={
										active
											? { scale: 1.15, y: -2 }
											: { scale: 1, y: 0 }
									}
									transition={spring.responsive}
									whileTap={{ scale: 0.85 }}
									className="relative flex flex-col items-center gap-1 py-1.5 px-3"
								>
									<div className="relative">
										<item.icon
											className={`w-5 h-5 transition-colors duration-200 ${
												active
													? "text-primary-rose"
													: isAccount && !isLoggedIn
														? "text-accent-gold"
														: "text-muted-foreground"
											}`}
										/>
										{isCart && cartCount > 0 && (
											<span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary-rose text-white text-[10px] font-bold flex items-center justify-center leading-none">
												{cartCount > 99
													? "99+"
													: cartCount}
											</span>
										)}
									</div>
									<motion.span
										animate={
											active
												? { opacity: 1 }
												: { opacity: 0.5 }
										}
										className={`text-[10px] font-medium transition-colors duration-200 ${
											active
												? "text-primary-rose"
												: isAccount && !isLoggedIn
													? "text-accent-gold opacity-100"
													: "text-muted-foreground"
										}`}
									>
										{isAccount && !isLoggedIn
											? "ورود"
											: item.label}
									</motion.span>
									{active && (
										<motion.div
											layoutId="bottom-nav-dot"
											className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary-rose"
											transition={spring.snappy}
										/>
									)}
								</motion.div>
							</div>
						);

						if (isCart) {
							return (
								<button
									key={item.href}
									className="flex-1"
									onClick={onCartOpen}
								>
									{inner}
								</button>
							);
						}

						if (isAccount && isLoggedIn) {
							return (
								<button
									key={item.href}
									className="flex-1"
									onClick={onAccountClick}
								>
									{inner}
								</button>
							);
						}

						return (
							<Link
								key={item.href}
								href={href}
								className="flex-1"
							>
								{inner}
							</Link>
						);
					})}
				</div>
			</div>
		</motion.nav>
	);
}

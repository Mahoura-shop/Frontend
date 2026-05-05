"use client";

import styles from "./Navbar.module.css";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Moon,
	Sun,
	Home,
	ShoppingBag,
	User,
	ShoppingCart,
	Search,
	LogOut,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useCartStore } from "@/store/useCartStore";
import useUserStore from "@/store/userStore/userStore";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Magnet from "../utils/Magnet";

const menuItems = [
	{ label: "محصولات", href: "/products" },
	{ label: "درباره ما", href: "/about" },
	{ label: "تماس با ما", href: "/contact" },
];

const bottomNavItems = [
	{ label: "خانه", icon: Home, href: "/" },
	{ label: "محصولات", icon: ShoppingBag, href: "/products" },
	{ label: "سبد خرید", icon: ShoppingCart, href: "/cart" },
	{ label: "حساب من", icon: User, href: "/dashboard" },
];

const useMagneticNav = () => {
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!ref.current) return;

			const rect = ref.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const distX = e.clientX - centerX;
			const distY = e.clientY - centerY;
			const distance = Math.sqrt(distX * distX + distY * distY);
			const maxDistance = 100;

			if (distance < maxDistance) {
				const strength = 1 - distance / maxDistance;
				const angle = Math.atan2(distY, distX);
				const pullDistance = strength * 25;
				setOffset({
					x: Math.cos(angle) * pullDistance,
					y: Math.sin(angle) * pullDistance,
				});
			} else {
				setOffset({ x: 0, y: 0 });
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return { ref, offset };
};

export default function Navbar() {
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();
	const router = useRouter();
	const { accessToken, firstName, lastName, logout } = useUserStore();
	const { fetchCart, getItemCount } = useCartStore();
	const itemCount = getItemCount();
	const [scrolled, setScrolled] = useState(false);

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
		}
	}, [accessToken]);

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	const isActive = (href: string) => {
		if (href === "/") return pathname === href;
		return pathname?.startsWith(href);
	};

	return (
		<>
			<motion.nav
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
			>
				<div className="w-full max-w-7xl mx-auto">
					<div className="flex items-center justify-between">
						<Link href="/">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-3 cursor-pointer"
							>
								<Image
									src={logo}
									alt="Mahoura"
									className="w-11 h-11 dark:invert"
								/>
							</motion.div>
						</Link>

						<div className="flex items-center gap-8">
							{menuItems.map((item, i) => (
								<Link
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
							className="flex items-center gap-3"
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

							{!accessToken ? (
								<Magnet padding={5}>
									<Link href="/signin">
										<Button className={`bg-accent-gold hover:bg-accent-gold rounded-full hover:opacity-90 transition-opacity ${styles.navbarCta}`}>
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
										<DropdownMenuTrigger asChild>
											<button className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary-plum to-primary-rose flex items-center justify-center text-white hover:shadow-lg transition-shadow">
												<User className="w-5 h-5" />
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="center"
											className="w-48"
										>
											<DropdownMenuLabel className="text-right">
												{firstName || lastName
													? `${firstName} ${lastName}`.trim()
													: "مستخدم"}
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem asChild>
												<Link
													href="/dashboard"
													className="flex items-center justify-end gap-2 cursor-pointer"
												>
													<User className="w-4 h-4" />
													حساب من
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link
													href="/cart"
													className="flex items-center justify-end gap-2 cursor-pointer"
												>
													<ShoppingCart className="w-4 h-4" />
													سبد خرید
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={handleLogout}
												className="text-destructive focus:text-destructive focus:bg-destructive/10 flex justify-end items-center gap-2"
											>
												<LogOut className="w-4 h-4" />
												خروج
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</motion.div>
							)}
						</motion.div>
					</div>
				</div>
			</motion.nav>

			{/* <motion.div
				initial={{ y: -60, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-lg border-b border-border md:hidden"
			>
				<div className="px-4 py-3 flex items-center justify-between">
					<Link href="/">
						<div className="flex items-center gap-2">
							<Image
								src={logo}
								alt="Mahoura"
								className="w-9 h-9 dark:invert"
							/>
							<span className="text-lg font-bold gradient-text">
								ماهورا
							</span>
						</div>
					</Link>

					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-full"
						>
							<Search className="w-4 h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-full"
							onClick={() =>
								setTheme(theme === "dark" ? "light" : "dark")
							}
						>
							<AnimatePresence mode="wait">
								{theme === "dark" ? (
									<motion.div
										key="sun"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<Sun className="w-4 h-4" />
									</motion.div>
								) : (
									<motion.div
										key="moon"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<Moon className="w-4 h-4" />
									</motion.div>
								)}
							</AnimatePresence>
						</Button>
						{!accessToken ? (
							<Link href="/signin" className="mr-2">
								<Button
									size="sm"
									className="bg-gradient-to-r from-secondary-plum to-primary-rose hover:opacity-90 transition-opacity text-xs h-8 px-3"
								>
									ورود
								</Button>
							</Link>
						) : (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-9 w-9 rounded-full ml-2 bg-gradient-to-r from-secondary-plum/20 to-primary-rose/20"
									>
										<User className="w-4 h-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="center"
									className="w-48"
								>
									<DropdownMenuLabel className="text-right">
										{firstName || lastName
											? `${firstName} ${lastName}`.trim()
											: "مستخدم"}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link
											href="/dashboard"
											className="cursor-pointer justify-end flex items-center gap-2"
										>
											<User className="w-4 h-4" />
											حساب من
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link
											href="/cart"
											className="cursor-pointer justify-end flex items-center gap-2"
										>
											<ShoppingCart className="w-4 h-4" />
											سبد خرید
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={handleLogout}
										className="text-destructive focus:text-destructive focus:bg-destructive/10 justify-end flex items-center gap-2"
									>
										<LogOut className="w-4 h-4" />
										خروج
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			</motion.div> */}

			<BottomNav isActive={isActive} cartCount={itemCount} />
		</>
	);
}

function BottomNav({
	isActive,
	cartCount,
}: {
	isActive: (href: string) => boolean;
	cartCount: number;
}) {
	return (
		<motion.nav
			initial={{ y: 100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{
				type: "spring",
				stiffness: 260,
				damping: 28,
				delay: 0.1,
			}}
			className="fixed bottom-0 inset-x-0 z-50 md:hidden px-3 pb-3"
			style={{
				paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)",
			}}
		>
			<div className="w-full bg-background/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/20">
				<div className="flex items-center justify-around px-2 py-2">
					{bottomNavItems.map((item) => {
						const active = isActive(item.href);

						return (
							<Link
								key={item.href}
								href={item.href}
								className="flex-1"
							>
								<div className="relative flex flex-col items-center justify-center py-1">
									{active && (
										<motion.div
											layoutId="bottom-nav-pill"
											className="absolute inset-0 bg-gradient-to-br from-primary-rose/20 via-accent-gold/10 to-secondary-plum/10 rounded-xl"
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 35,
											}}
										/>
									)}

									<motion.div
										animate={
											active
												? { scale: 1.15, y: -2 }
												: { scale: 1, y: 0 }
										}
										transition={{
											type: "spring",
											stiffness: 400,
											damping: 25,
										}}
										whileTap={{ scale: 0.85 }}
										className="relative flex flex-col items-center gap-1 py-1.5 px-3"
									>
										<div className="relative">
											<item.icon
												className={`w-5 h-5 transition-colors duration-200 ${
													active
														? "text-primary-rose"
														: "text-muted-foreground"
												}`}
											/>
											{item.href === "/cart" &&
												cartCount > 0 && (
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
													: "text-muted-foreground"
											}`}
										>
											{item.label}
										</motion.span>

										{active && (
											<motion.div
												layoutId="bottom-nav-dot"
												className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary-rose"
												transition={{
													type: "spring",
													stiffness: 400,
													damping: 35,
												}}
											/>
										)}
									</motion.div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</motion.nav>
	);
}

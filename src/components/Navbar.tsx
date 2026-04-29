"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Home, ShoppingBag, User, ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useCartStore } from "@/store/useCartStore";
import useUserStore from "@/store/userStore/userStore";

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

export default function Navbar() {
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();
	const { accessToken } = useUserStore();
	const { fetchCart, getItemCount } = useCartStore();
	const itemCount = getItemCount();

	useEffect(() => {
		if (accessToken) {
			fetchCart();
		}
	}, [accessToken]);

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
				className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border hidden md:block"
			>
				<div className="w-full max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<Link href="/">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-3 cursor-pointer"
							>
								<Image src={logo} alt="Mahoura" className="w-11 h-11 dark:invert" />
							</motion.div>
						</Link>

						<div className="flex items-center gap-8">
							{menuItems.map((item, i) => (
								<motion.div
									key={item.href}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 + i * 0.08 }}
								>
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
												pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
											}`}
										/>
									</Link>
								</motion.div>
							))}
						</div>

						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.4 }}
							className="flex items-center gap-2"
						>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
								className="rounded-full"
							>
								<AnimatePresence mode="wait">
									{theme === "dark" ? (
										<motion.div
											key="sun"
											initial={{ rotate: -90, opacity: 0 }}
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
						</motion.div>
					</div>
				</div>
			</motion.nav>

			<motion.div
				initial={{ y: -60, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-lg border-b border-border md:hidden"
			>
				<div className="px-4 py-3 flex items-center justify-between">
					<Link href="/">
						<div className="flex items-center gap-2">
							<Image src={logo} alt="Mahoura" className="w-9 h-9 dark:invert" />
							<span className="text-lg font-bold gradient-text">ماهورا</span>
						</div>
					</Link>

					<div className="flex items-center gap-1">
						<Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
							<Search className="w-4 h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-full"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
					</div>
				</div>
			</motion.div>

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
			transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.1 }}
			className="fixed bottom-0 inset-x-0 z-50 md:hidden px-3 pb-3"
			style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
		>
			<div className="w-full bg-background/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/20">
				<div className="flex items-center justify-around px-2 py-2">
					{bottomNavItems.map((item) => {
						const active = isActive(item.href);

						return (
							<Link key={item.href} href={item.href} className="flex-1">
								<div className="relative flex flex-col items-center justify-center py-1">
									{active && (
										<motion.div
											layoutId="bottom-nav-pill"
											className="absolute inset-0 bg-gradient-to-br from-primary-rose/20 via-accent-gold/10 to-secondary-plum/10 rounded-xl"
											transition={{ type: "spring", stiffness: 400, damping: 35 }}
										/>
									)}

									<motion.div
										animate={active ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
										transition={{ type: "spring", stiffness: 400, damping: 25 }}
										whileTap={{ scale: 0.85 }}
										className="relative flex flex-col items-center gap-1 py-1.5 px-3"
									>
										<div className="relative">
											<item.icon
												className={`w-5 h-5 transition-colors duration-200 ${
													active ? "text-primary-rose" : "text-muted-foreground"
												}`}
											/>
											{item.href === "/cart" && cartCount > 0 && (
												<span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary-rose text-white text-[10px] font-bold flex items-center justify-center leading-none">
													{cartCount > 99 ? "99+" : cartCount}
												</span>
											)}
										</div>

										<motion.span
											animate={active ? { opacity: 1 } : { opacity: 0.5 }}
											className={`text-[10px] font-medium transition-colors duration-200 ${
												active ? "text-primary-rose" : "text-muted-foreground"
											}`}
										>
											{item.label}
										</motion.span>

										{active && (
											<motion.div
												layoutId="bottom-nav-dot"
												className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary-rose"
												transition={{ type: "spring", stiffness: 400, damping: 35 }}
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

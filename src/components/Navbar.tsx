"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
	Moon, 
	Sun, 
	Menu, 
	X, 
	Globe, 
	Home, 
	ShoppingBag, 
	User,
	Heart,
	Search
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const [language, setLanguage] = useState<"fa" | "en">("fa");
	const pathname = usePathname();

	const menuItems = [
		{ label: "محصولات", labelEn: "Products", href: "/products" },
		{ label: "درباره ما", labelEn: "About Us", href: "/about" },
		{ label: "تماس با ما", labelEn: "Contact Us", href: "/contact" },
	];

	// Bottom navigation items for mobile
	const bottomNavItems = [
		{ label: "خانه", icon: Home, href: "/" },
		{ label: "محصولات", icon: ShoppingBag, href: "/products" },
		{ label: "علاقه‌مندی", icon: Heart, href: "/dashboard/wishlist" },
		{ label: "حساب من", icon: User, href: "/dashboard" },
	];

	const toggleLanguage = () => {
		setLanguage(language === "fa" ? "en" : "fa");
	};

	const isActive = (href: string) => {
		if (href === "/") {
			return pathname === href;
		}
		return pathname?.startsWith(href);
	};

	return (
		<>
			{/* Desktop & Tablet - Top Navbar */}
			<motion.nav
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm md:block hidden"
			>
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<Link href="/">
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2, type: "spring" }}
								className="text-3xl font-bold gradient-text cursor-pointer"
							>
								<div className="flex gap-4 place-items-center">
									<Image
										src={logo}
										alt="Mahoura"
										className="w-12 h-12 dark:invert"
									/>
								</div>
							</motion.div>
						</Link>

						{/* Desktop Menu */}
						<div className="flex items-center gap-8">
							{menuItems?.map((item, i) => (
								<motion.div
									key={item.href}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 + i * 0.1 }}
								>
									<Link
										href={item.href}
										className={`text-foreground hover:text-primary transition-colors relative group ${
											pathname === item.href
												? "text-primary"
												: ""
										}`}
									>
										{language === "fa"
											? item.label
											: item.labelEn}
										<span
											className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-rose to-accent-gold transition-all ${
												pathname === item.href
													? "w-full"
													: "w-0 group-hover:w-full"
											}`}
										/>
									</Link>
								</motion.div>
							))}
						</div>

						{/* Actions */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.6 }}
							className="flex items-center gap-3"
						>
							{/* Theme Toggle */}
							<Button
								variant="ghost"
								size="icon"
								onClick={() =>
									setTheme(theme === "dark" ? "light" : "dark")
								}
							>
								{theme === "dark" ? (
									<Sun className="w-5 h-5" />
								) : (
									<Moon className="w-5 h-5" />
								)}
							</Button>
						</motion.div>
					</div>
				</div>
			</motion.nav>

			{/* Mobile - Top Bar (Minimal) */}
			<motion.div
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm md:hidden"
			>
				<div className="px-4 py-3 flex items-center justify-between">
					<Link href="/">
						<div className="flex gap-2 items-center">
							<Image
								src={logo}
								alt="Mahoura"
								className="w-10 h-10 dark:invert"
							/>
							<span className="text-xl font-bold gradient-text">ماهورا</span>
						</div>
					</Link>

					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9"
						>
							<Search className="w-5 h-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9"
							onClick={() =>
								setTheme(theme === "dark" ? "light" : "dark")
							}
						>
							{theme === "dark" ? (
								<Sun className="w-5 h-5" />
							) : (
								<Moon className="w-5 h-5" />
							)}
						</Button>
					</div>
				</div>
			</motion.div>

			{/* Mobile - Bottom Navigation */}
			{/* <motion.nav
				initial={{ y: 100 }}
				animate={{ y: 0 }}
				className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border shadow-lg"
			>
				<div className="grid grid-cols-4 gap-1 px-2 py-2">
					{bottomNavItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="flex flex-col items-center justify-center"
						>
							<motion.div
								whileTap={{ scale: 0.9 }}
								className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-lg transition-all ${
									isActive(item.href)
										? "bg-gradient-to-br from-primary-rose/20 via-accent-gold/10 to-secondary-plum/5"
										: ""
								}`}
							>
								<item.icon
									className={`w-6 h-6 transition-colors ${
										isActive(item.href)
											? "text-primary-rose"
											: "text-muted-foreground"
									}`}
								/>
								<span
									className={`text-xs font-medium transition-colors ${
										isActive(item.href)
											? "text-primary-rose"
											: "text-muted-foreground"
									}`}
								>
									{item.label}
								</span>
							</motion.div>
						</Link>
					))}
				</div>
			</motion.nav> */}

			{/* Add padding to content for mobile bottom nav */}
			{/* <style jsx global>{`
				@media (max-width: 768px) {
					body {
						padding-bottom: 70px;
					}
				}
			`}</style> */}
		</>
	);
}
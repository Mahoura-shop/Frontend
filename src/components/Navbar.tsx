"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Menu, X, Globe } from "lucide-react";
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

	const toggleLanguage = () => {
		setLanguage(language === "fa" ? "en" : "fa");
	};

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
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
								{/* <p>Mahoura</p> */}
							</div>
						</motion.div>
					</Link>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center gap-8">
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
						{/* Language Toggle */}
						{/* <Button
							variant="ghost"
							size="icon"
							onClick={toggleLanguage}
							className="hidden md:flex"
						>
							<Globe className="w-5 h-5" />
						</Button> */}

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

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setIsOpen(!isOpen)}
						>
							{isOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</Button>
					</motion.div>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden mt-4 pb-4 border-t border-border pt-4"
					>
						{menuItems?.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsOpen(false)}
								className={`block py-3 text-foreground hover:text-primary transition-colors ${
									pathname === item.href
										? "text-primary font-bold"
										: ""
								}`}
							>
								{language === "fa" ? item.label : item.labelEn}
							</Link>
						))}
						<Button
							variant="ghost"
							onClick={toggleLanguage}
							className="w-full justify-start mt-2"
						>
							<Globe className="w-5 h-5 ml-2" />
							{language === "fa" ? "English" : "فارسی"}
						</Button>
					</motion.div>
				)}
			</div>
		</motion.nav>
	);
}

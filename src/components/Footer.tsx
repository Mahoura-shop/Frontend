"use client";

import { motion } from "framer-motion";
import { Instagram, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

export default function Footer() {
	const footerLinks = {
		products: [
			{ label: "همه محصولات", href: "/products" },
			{ label: "جدیدترین‌ها", href: "/products?filter=new" },
			{ label: "پرفروش‌ترین‌ها", href: "/products?filter=popular" },
		],
		support: [
			{ label: "درباره ما", href: "/about" },
			{ label: "تماس با ما", href: "/contact" },
			// { label: "سوالات متداول", href: "/faq" },
			// { label: "شرایط استفاده", href: "/terms" },
		],
	};

	return (
		<footer className="bg-secondary-plum text-white py-8">
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className="container mx-auto px-4"
			>
				<div className="grid md:grid-cols-4 gap-7 mb-12">
					{/* Brand */}
					<div>
						{/* <h3 className="text-2xl font-bold mb-4 text-accent-gold">
							Mahoura
						</h3> */}
						<Image
							src={logo}
							alt="Mahoura"
							className="w-32 h-32 place-self-center dark:invert"
						/>
						<p className="text-white/80">
							تجربه زیبایی بی‌نظیر با محصولات لوکس ماهورا
						</p>
					</div>

					{/* Products Links */}
					<div>
						<h4 className="font-bold mb-4">محصولات</h4>
						<ul className="space-y-2">
							{footerLinks.products?.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-white/80 hover:text-white transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Support Links */}
					<div>
						<h4 className="font-bold mb-4">پشتیبانی</h4>
						<ul className="space-y-2">
							{footerLinks.support?.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-white/80 hover:text-white transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h4 className="font-bold mb-4">تماس با ما</h4>
						<div className="space-y-3">
							<p className="flex items-center gap-2 text-white/80">
								<Phone className="w-4 h-4" />
								<p className="ltr">+989173362580</p>
							</p>
							{/* <p className="flex items-center gap-2 text-white/80">
                <Mail className="w-4 h-4" />
                info@mahoura.com
              </p> */}
							<div className="flex gap-4 pt-4">
								{[Instagram].map((Icon, i) => (
									<motion.a
										key={i}
										href="#"
										whileHover={{ scale: 1.2, rotate: 10 }}
										className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
									>
										<Icon className="w-5 h-5" />
									</motion.a>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="border-t border-white/20 pt-8 text-center text-white/60">
					<p>© 1404 ماهورا. تمامی حقوق محفوظ است.</p>
				</div>
			</motion.div>
		</footer>
	);
}

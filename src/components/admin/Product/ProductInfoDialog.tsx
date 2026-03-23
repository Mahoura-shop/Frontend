"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Package,
	Globe,
	Calendar,
	Image as ImageIcon,
	CheckCircle2,
	XCircle,
	Eye,
	Hash,
	DollarSign,
	ShoppingCart,
	TrendingUp,
	Tag,
	Star,
	Layers,
	Award,
	ShoppingBag,
	UserStarIcon,
	HandCoinsIcon,
	Banknote,
	UserStar,
	HandCoins,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProductInfoDialogProps {
	product: Product;
	variant?: "eye" | "name";
	className?: string;
}

export default function ProductInfoDialog({
	product,
	className,
	variant = "eye",
}: ProductInfoDialogProps) {
	const [open, setOpen] = useState(false);

	const containerVariants = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.3,
				staggerChildren: 0.1,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			transition: { duration: 0.2 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 300, damping: 25 },
		},
	};

	const imageVariants = {
		hidden: { opacity: 0, scale: 0.8, rotate: -5 },
		visible: {
			opacity: 1,
			scale: 1,
			rotate: 0,
			transition: { type: "spring", stiffness: 300, damping: 20 },
		},
	};

	// Format price with currency
	const formatPrice = (price: number, currency: string) => {
		const formatted = new Intl.NumberFormat("fa-IR").format(price);
		const currencySymbol =
			{
				IRR: "ریال",
				USD: "دلار",
				EUR: "یورو",
				GBP: "پوند",
				AED: "درهم",
				TRY: "لیر",
			}[currency] || currency;
		return `${formatted} ${currencySymbol}`;
	};

	// Format quantity with type
	const formatQuantity = (quantity: number, type: string) => {
		const formatted = new Intl.NumberFormat("fa-IR").format(quantity);
		return `${formatted} ${type}`;
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild className={cn(className)}>
				{variant === "eye" ? (
					<Button
						size="icon"
						variant="secondary"
						className="h-8 w-8 hover:bg-background/80"
					>
						<Eye className="w-4 h-4" />
					</Button>
				) : (
					<Button variant="secondary">{product.name}</Button>
				)}
			</DialogTrigger>

			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto pb-6">
				<AnimatePresence mode="wait">
					{open && (
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							{/* Header */}
							<DialogHeader className="space-y-0 pb-4">
								<div className="flex items-start justify-between gap-4">
									<motion.div
										variants={itemVariants}
										className="flex-1"
									>
										<div className="flex items-center gap-3 mb-2">
											<DialogTitle className="text-2xl">
												{product.name}
											</DialogTitle>
											{product.isNew && (
												<Badge
													variant="new"
													className="gap-1"
												>
													<Star className="w-3 h-3" />
													جدید
												</Badge>
											)}
										</div>
										<div className="flex items-center gap-2 text-muted-foreground">
											<Globe className="w-4 h-4" />
											<span className="text-sm font-mono">
												{product.slug}
											</span>
										</div>
									</motion.div>

									{/* Status Badge */}
									<div className="flex flex-col gap-2 px-4">
										<motion.div
											variants={itemVariants}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											// className="flex flex-col gap-2 px-4"
										>
											<Badge
												variant={
													product.isActive
														? "available"
														: "outOfStock"
												}
												className="gap-2 px-3 py-1"
											>
												{product.isActive ? (
													<>
														<CheckCircle2 className="w-3 h-3" />
														فعال
													</>
												) : (
													<>
														<XCircle className="w-3 h-3" />
														غیرفعال
													</>
												)}
											</Badge>
										</motion.div>

										{product.quantity === 0 && (
											<motion.div
												variants={itemVariants}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												// className="flex flex-col gap-2 px-4"
											>
												<Badge
													variant="outOfStock"
													className="px-3 py-1"
												>
													اتمام موجودی
												</Badge>
											</motion.div>
										)}
									</div>
								</div>
							</DialogHeader>

							<Separator className="my-4" />

							{/* Content */}
							<div className="space-y-6">
								{/* Image Section */}
								<motion.div
									variants={itemVariants}
									className="flex justify-center"
								>
									{product.productPic ? (
										<motion.div
											variants={imageVariants}
											className="relative group"
										>
											<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
											<img
												src={product.productPic}
												alt={product.name}
												className="relative w-full max-w-md h-64 object-cover rounded-2xl border-4 border-background shadow-2xl"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
										</motion.div>
									) : (
										<motion.div
											variants={imageVariants}
											className="w-full max-w-md h-64 rounded-2xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center bg-muted/20"
										>
											<ImageIcon className="w-16 h-16 text-muted-foreground/50 mb-2" />
											<p className="text-sm text-muted-foreground">
												تصویری موجود نیست
											</p>
										</motion.div>
									)}
								</motion.div>

								{/* Price Section */}
								<motion.div variants={itemVariants}>
									<div className="bg-gradient-to-br from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-6 rounded-2xl border-2 border-primary-rose/20">
										<div className="text-center">
											<p className="text-sm text-muted-foreground mb-2">
												قیمت محصول
											</p>
											<p className="text-4xl font-bold gradient-text">
												{formatPrice(
													Number(product.price),
													product.currency.name,
												)}
											</p>
										</div>
									</div>
								</motion.div>

								{/* Description */}
								{product.description && (
									<motion.div
										variants={itemVariants}
										className="space-y-3"
									>
										<div className="flex items-center gap-2">
											<div className="w-1 h-5 bg-gradient-to-b from-primary-rose to-accent-gold rounded-full" />
											<h3 className="text-sm font-semibold">
												توضیحات
											</h3>
										</div>
										<motion.div
											whileHover={{ scale: 1.01 }}
											className="bg-gradient-to-br from-muted/50 to-muted/30 p-4 rounded-xl border border-border/50"
										>
											<p className="text-sm leading-relaxed">
												{product.description}
											</p>
										</motion.div>
									</motion.div>
								)}

								<Separator />

								{/* Basic Info Grid */}
								<motion.div variants={itemVariants}>
									<div className="flex items-center gap-2 mb-4">
										<div className="w-1 h-5 bg-gradient-to-b from-primary-rose to-accent-gold rounded-full" />
										<h3 className="text-sm font-semibold">
											اطلاعات اصلی
										</h3>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{/* ID */}
										{product.id && (
											<InfoItem
												icon={
													<Hash className="w-4 h-4" />
												}
												label="شناسه محصول"
												value={`#${product.id}`}
											/>
										)}

										{/* IrrPrice */}
										{product.irrPrice && (
											<InfoItem
												icon={
													<DollarSign className="w-4 h-4" />
												}
												label="قیمت ریالی"
												value={`${formatPrice(
													Number(product.irrPrice),
													"ریال",
												)}`}
											/>
										)}

										{/* Fellow Price */}
										{product.step1Price && (
											<InfoItem
												icon={
													<UserStar className="w-4 h-4" />
												}
												label="قیمت همکار"
												value={`${formatPrice(
													Number(product.step1Price),
													"ریال",
												)}`}
											/>
										)}

										{/* ShopKeeper Cash Price */}
										{product.step2Price && (
											<InfoItem
												icon={
													<HandCoins className="w-4 h-4" />
												}
												label="قیمت مغازه نقدی"
												value={`${formatPrice(
													Number(product.step2Price),
													"ریال",
												)}`}
											/>
										)}

										{/* ShopKeeper Cheque Price */}
										{product.step3Price && (
											<InfoItem
												icon={
													<Banknote className="w-4 h-4" />
												}
												label="قیمت مغازه چکی"
												value={`${formatPrice(
													Number(product.step3Price),
													"ریال",
												)}`}
											/>
										)}

										{/* Regular Price */}
										{product.step4Price && (
											<InfoItem
												icon={
													<ShoppingBag className="w-4 h-4" />
												}
												label="قیمت تکی"
												value={`${formatPrice(
													Number(product.step4Price),
													"ریال",
												)}`}
											/>
										)}

										{/* Category */}
										{product.category && (
											<InfoItem
												icon={
													<Layers className="w-4 h-4" />
												}
												label="دسته‌بندی"
												value={product.category.name}
											/>
										)}

										{/* Brand */}
										{product.brand && (
											<InfoItem
												icon={
													<Award className="w-4 h-4" />
												}
												label="برند"
												value={product.brand.name}
											/>
										)}

										{/* Quantity */}
										<InfoItem
											icon={
												<Package className="w-4 h-4" />
											}
											label="موجودی"
											value={formatQuantity(
												product.quantity,
												product.quantityType,
											)}
											highlight={product.quantity === 0}
										/>

										{/* Min Order */}
										{product.minOrder && (
											<InfoItem
												icon={
													<ShoppingCart className="w-4 h-4" />
												}
												label="حداقل سفارش"
												value={formatQuantity(
													product.minOrder,
													product.quantityType,
												)}
											/>
										)}

										{/* Priority */}
										{product.priority !== undefined &&
											product.priority > 0 && (
												<InfoItem
													icon={
														<TrendingUp className="w-4 h-4" />
													}
													label="اولویت نمایش"
													value={new Intl.NumberFormat(
														"fa-IR",
													).format(product.priority)}
												/>
											)}

										{/* Consumer Price */}
										{product.consumerPrice && (
											<InfoItem
												icon={
													<ShoppingBag className="w-4 h-4" />
												}
												label="قیمت مصرف‌کننده"
												value={formatPrice(
													product.consumerPrice,
													"ریال",
												)}
											/>
										)}
									</div>
								</motion.div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
}

// Helper Component for Info Items
function InfoItem({
	icon,
	label,
	value,
	highlight = false,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	highlight?: boolean;
}) {
	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 border border-border/50 hover:border-primary-rose/30 transition-all ${
				highlight ? "border-destructive/50 bg-destructive/5" : ""
			}`}
		>
			<div
				className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${
					highlight
						? "from-destructive/20 via-destructive/10 to-destructive/5"
						: "from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20"
				} flex items-center justify-center`}
			>
				<div
					className={
						highlight ? "text-destructive" : "text-primary-rose"
					}
				>
					{icon}
				</div>
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-xs text-muted-foreground mb-0.5">{label}</p>
				<p
					className={`text-sm font-semibold truncate ${
						highlight ? "text-destructive" : ""
					}`}
				>
					{value}
				</p>
			</div>
		</motion.div>
	);
}

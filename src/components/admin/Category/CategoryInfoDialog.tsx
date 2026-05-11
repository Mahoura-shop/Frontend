"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spring } from "@/lib/motion";
import {
	Package,
	Globe,
	Calendar,
	Image as ImageIcon,
	CheckCircle2,
	XCircle,
	Eye,
	Edit,
	Trash2,
	Hash,
	X,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CategoryInfoDialogProps {
	category: Category;
	onEdit?: () => void;
	onDelete?: () => void;
}

export default function CategoryInfoDialog({
	category,
}: CategoryInfoDialogProps) {
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
			transition: spring.default,
		},
	};

	const imageVariants = {
		hidden: { opacity: 0, scale: 0.8, rotate: -5 },
		visible: {
			opacity: 1,
			scale: 1,
			rotate: 0,
			transition: spring.gentle,
		},
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="secondary"
					className="h-8 w-8 hover:bg-background/80"
				>
					<Eye className="w-4 h-4" />
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto pb-6">
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
										<DialogTitle className="text-2xl gradient-text">
											{category.name}
										</DialogTitle>
										<div className="flex items-center gap-2 text-muted-foreground mt-2">
											<Globe className="w-4 h-4" />
											<span className="text-sm font-mono">
												{category.slug}
											</span>
										</div>
									</motion.div>

									{/* Status Badge */}
									<motion.div
										variants={itemVariants}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="h-full flex place-self-center"
									>
										<Badge
											variant={
												category.isActive
													? "available"
													: "outOfStock"
											}
											className="gap-2 px-3 py-1"
										>
											{category.isActive ? (
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
									{category.categoryPic ? (
										<motion.div
											variants={imageVariants}
											className="relative group"
										>
											<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
											<img
												src={category.categoryPic}
												alt={category.name}
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

								{/* Description */}
								{category.description && (
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
												{category.description}
											</p>
										</motion.div>
									</motion.div>
								)}

								<Separator />

								{/* Info Grid */}
								<motion.div variants={itemVariants}>
									<div className="flex items-center gap-2 mb-4">
										<div className="w-1 h-5 bg-gradient-to-b from-primary-rose to-accent-gold rounded-full" />
										<h3 className="text-sm font-semibold">
											اطلاعات تکمیلی
										</h3>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{/* ID */}
										{category.id && (
											<InfoItem
												icon={
													<Hash className="w-4 h-4" />
												}
												label="شناسه"
												value={`#${category.id}`}
											/>
										)}

										{/* Products Count */}
										{category.count !==
											undefined && (
											<InfoItem
												icon={
													<Package className="w-4 h-4" />
												}
												label="تعداد محصولات"
												value={new Intl.NumberFormat(
													"fa-IR",
												).format(
													category.count,
												)}
											/>
										)}
									</div>
								</motion.div>

								{/* <Separator />

								<motion.div
									variants={itemVariants}
									className="flex items-center justify-end gap-3 pt-2"
								>
									{onEdit && (
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Button
												variant="outline"
												onClick={() => {
													onEdit();
													setOpen(false);
												}}
												className="gap-2"
											>
												<Edit className="w-4 h-4" />
												ویرایش
											</Button>
										</motion.div>
									)}

									{onDelete && (
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Button
												variant="outline"
												onClick={() => {
													onDelete();
													setOpen(false);
												}}
												className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
											>
												<Trash2 className="w-4 h-4" />
												حذف
											</Button>
										</motion.div>
									)}
								</motion.div> */}
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
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 border border-border/50 hover:border-primary-rose/30 transition-all"
		>
			<div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20 flex items-center justify-center">
				<div className="text-primary-rose">{icon}</div>
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-xs text-muted-foreground mb-0.5">{label}</p>
				<p className="text-sm font-semibold truncate">{value}</p>
			</div>
		</motion.div>
	);
}

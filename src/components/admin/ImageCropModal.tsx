"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import CustomToast from "../Custom/CustomToast/CustomToast";

interface ImageCropModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (croppedImage: string) => void;
	aspectRatio?: number;
}

export default function ImageCropModal({
	isOpen,
	onClose,
	onSave,
	aspectRatio = 1,
}: ImageCropModalProps) {
	const [image, setImage] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (file: File) => {
		if (!file.type.startsWith("image/")) {
			CustomToast("لطفا یک فایل تصویری انتخاب کنید", "error");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			CustomToast("حجم فایل نباید بیشتر از ۵ مگابایت باشد", "error");
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			setImage(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) handleFileSelect(file);
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleFileSelect(file);
	};

	const handleSave = () => {
		if (!image) {
			CustomToast("لطفا ابتدا تصویری انتخاب کنید", "error");
			return;
		}
		onSave(image);
		CustomToast("تصویر با موفقیت ذخیره شد", "success");
		handleClose();
	};

	const handleClose = () => {
		setImage(null);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={handleClose}
					className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				/>

				{/* Modal */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					className="relative z-10 w-full max-w-2xl"
				>
					<Card className="p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold">
								آپلود و ویرایش تصویر
							</h2>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleClose}
							>
								<X className="w-5 h-5" />
							</Button>
						</div>

						{!image ? (
							<div
								onDrop={handleDrop}
								onDragOver={(e) => {
									e.preventDefault();
									setIsDragging(true);
								}}
								onDragLeave={() => setIsDragging(false)}
								className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
									isDragging
										? "border-primary bg-primary/5"
										: "border-muted-foreground/25 hover:border-primary/50"
								}`}
							>
								<Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
								<p className="text-lg font-medium mb-2">
									تصویر را اینجا رها کنید یا کلیک کنید
								</p>
								<p className="text-sm text-muted-foreground mb-4">
									JPG, PNG یا WEBP (حداکثر ۵ مگابایت)
								</p>
								<Button
									onClick={() =>
										fileInputRef.current?.click()
									}
									variant="outline"
								>
									انتخاب فایل
								</Button>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleFileInput}
									className="hidden"
								/>
							</div>
						) : (
							<div className="space-y-4">
								<div className="relative bg-muted rounded-lg overflow-hidden">
									<img
										src={image}
										alt="Preview"
										className="w-full h-auto max-h-96 object-contain"
									/>
								</div>

								<div className="flex justify-between">
									<Button
										variant="outline"
										onClick={() => setImage(null)}
										className="gap-2"
									>
										<RotateCw className="w-4 h-4" />
										تصویر دیگری انتخاب کنید
									</Button>

									<div className="flex gap-2">
										<Button
											variant="outline"
											onClick={handleClose}
										>
											لغو
										</Button>
										<Button
											onClick={handleSave}
											className="gap-2"
										>
											<Check className="w-4 h-4" />
											ذخیره تصویر
										</Button>
									</div>
								</div>
							</div>
						)}
					</Card>
				</motion.div>
			</div>
		</AnimatePresence>
	);
}

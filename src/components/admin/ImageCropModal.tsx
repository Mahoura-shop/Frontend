"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, RotateCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useField } from "formik";
import CustomToast from "../Custom/CustomToast/CustomToast";

interface ImageCropModalProps {
	// isOpen: boolean;
	// onClose: () => void;
	// onSave: (croppedImage: string) => void;
	name: string;
	aspectRatio?: number;
	// image: string | null;
	// setImage: React.Dispatch<React.SetStateAction<string | null>>;
	helperText?: string;
	label?: string;
}

export default function ImageCropModal({
	// isOpen,
	// onClose,
	// onSave,
	name,
	// image,
	// setImage,
	aspectRatio = 1,
	label = "تصویر",
	helperText = "JPG, PNG یا WEBP (حداکثر ۵ مگابایت)",
}: ImageCropModalProps) {
	// const [image, setImage] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [field, meta, helpers] = useField(name);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const image = field.value || null;
	const hasError = meta.touched && meta.error;

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
			const base64 = e.target?.result as string;
			helpers.setValue(base64); // Set Formik value
			helpers.setTouched(true); // Mark as touched
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

	const handleRemove = () => {
		helpers.setValue(null);
		helpers.setTouched(true);
	};

	return (
		<div className="space-y-2">
			{/* Label */}
			{label && (
				<label className="text-sm font-medium">
					{label}
				</label>
			)}

			{/* Upload Area or Preview */}
			{!image ? (
				<div
					onDrop={handleDrop}
					onDragOver={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={() => setIsDragging(false)}
					className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
						isDragging
							? "border-primary bg-primary/5"
							: hasError
							? "border-destructive bg-destructive/5"
							: "border-muted-foreground/25 hover:border-primary/50"
					}`}
					onClick={() => fileInputRef.current?.click()}
				>
					<Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
					<p className="text-base font-medium mb-1">
						تصویر را اینجا رها کنید یا کلیک کنید
					</p>
					<p className="text-xs text-muted-foreground">
						{helperText}
					</p>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileInput}
						className="hidden"
					/>
				</div>
			) : (
				<div className="space-y-3">
					{/* Image Preview */}
					<div className="relative bg-muted rounded-lg overflow-hidden border-2 border-border">
						<img
							src={image}
							alt="Preview"
							className="w-full h-auto max-h-64 object-contain"
						/>
					</div>

					{/* Actions */}
					<div className="flex gap-4 px-3">
						<Button
							type="button"
							onClick={handleRemove}
							className="flex-1 gap-2 bg-delete hover:bg-delete-hover"
						>
							<Trash2 className="w-4 h-4" />
							حذف تصویر
						</Button>
						<Button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="flex-1"
						>
							تغییر تصویر
						</Button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileInput}
							className="hidden"
						/>
					</div>
				</div>
			)}

			{/* Error Message */}
			{hasError && (
				<p className="text-sm text-destructive mt-1">
					{meta.error}
				</p>
			)}
		</div>
	);

	return (
		<>
			{/* <div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold">آپلود و ویرایش تصویر</h2>
				<Button variant="ghost" size="icon" onClick={handleClose}>
					<X className="w-5 h-5" />
				</Button>
			</div> */}

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
						onClick={() => fileInputRef.current?.click()}
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

					<div className="flex justify-between p-2">
						<Button
							onClick={handleRemove}
							className="gap-2 bg-delete hover:bg-delete-hover"
						>
							<Trash2 className="w-4 h-4" />
							حذف تصویر
						</Button>
					</div>
				</div>
			)}
		</>
	);
}

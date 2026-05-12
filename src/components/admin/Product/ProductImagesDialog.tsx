"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { deleteData, postImageData } from "@/services/services";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";

interface ProductImage {
	id: number;
	path: string;
}

export default function ProductImagesDialog({
	productID,
	images,
	fetchProducts,
}: {
	productID: number;
	images: ProductImage[];
	fetchProducts: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [deletingIDs, setDeletingIDs] = useState<Set<number>>(new Set());
	const [deletedIDs, setDeletedIDs] = useState<Set<number>>(new Set());
	const inputRef = useRef<HTMLInputElement>(null);

	const visibleImages = images.filter((img) => !deletedIDs.has(img.id));

	const handleOpen = (v: boolean) => {
		setOpen(v);
		if (v) setDeletedIDs(new Set());
	};

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("image", file);
			await postImageData({
				endPoint: `/v1/product/${productID}/images`,
				data: formData,
			});
			CustomToast("تصویر اضافه شد", "success");
			fetchProducts();
		} catch {
			CustomToast("خطا در آپلود تصویر", "error");
		} finally {
			setUploading(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	};

	const handleDelete = async (imageID: number) => {
		setDeletingIDs((prev) => new Set(prev).add(imageID));
		try {
			await deleteData({
				endPoint: `/v1/product/${productID}/images/${imageID}`,
			});
			setDeletedIDs((prev) => new Set(prev).add(imageID));
			CustomToast("تصویر حذف شد", "success");
			fetchProducts();
		} catch {
			CustomToast("خطا در حذف تصویر", "error");
		} finally {
			setDeletingIDs((prev) => {
				const next = new Set(prev);
				next.delete(imageID);
				return next;
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="secondary" className="h-8 w-8 hover:bg-background/80">
					<Images className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>تصاویر محصول</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto">
					{visibleImages.map((img) => (
						<div key={img.id} className="relative group rounded-lg overflow-hidden border aspect-square">
							<Image
								src={img.path}
								alt=""
								fill
								sizes="33vw"
								className="object-cover"
							/>
							<button
								onClick={() => handleDelete(img.id)}
								disabled={deletingIDs.has(img.id)}
								className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
							>
								<Trash2 className="w-5 h-5 text-white" />
							</button>
						</div>
					))}
					<button
						onClick={() => inputRef.current?.click()}
						disabled={uploading}
						className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
					>
						<ImagePlus className="w-6 h-6" />
						<span className="text-xs">{uploading ? "در حال آپلود..." : "افزودن"}</span>
					</button>
				</div>
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleUpload}
				/>
			</DialogContent>
		</Dialog>
	);
}

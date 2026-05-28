"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
	product: Product;
	selectedImage: number;
	onSelectImage: (i: number) => void;
}

export default function ProductImages({ product, selectedImage, onSelectImage }: Props) {
	const allImages = product.images?.length ? product.images : product.productPic ? [product.productPic] : [];

	return (
		<motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
			<div className="relative mb-4 rounded-2xl overflow-hidden shadow-2xl group h-[50vh] sm:h-80 lg:min-h-[80vh]">
				<AnimatePresence mode="wait">
					{allImages[selectedImage] ?? allImages[0] ? (
						<motion.div
							key={allImages[selectedImage] ?? allImages[0]}
							className="absolute inset-0"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							<Image
								src={allImages[selectedImage] ?? allImages[0]}
								alt={product.name}
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</motion.div>
					) : (
						<div className="absolute inset-0 flex items-center justify-center">
							<ImageIcon className="w-16 h-16 text-muted-foreground" />
						</div>
					)}
				</AnimatePresence>

				{product.isNew && (
					<Badge variant="new" className="absolute top-4 right-4 z-10">
						<Star className="w-3 h-3 me-1" />
						جدید
					</Badge>
				)}

				{product.quantity === 0 && (
					<div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
						<div className="text-center text-white">
							<h3 className="text-3xl font-bold mb-2">ناموجود</h3>
							<Button variant="secondary">اطلاع از موجود شدن</Button>
						</div>
					</div>
				)}
			</div>

			{allImages.length > 1 && (
				<div className="grid grid-cols-4 gap-3 mt-4">
					{allImages.map((img, i) => (
						<motion.button
							key={i}
							onClick={() => onSelectImage(i)}
							className={`relative rounded-lg overflow-hidden border-2 transition-colors h-20 ${selectedImage === i ? "border-primary-rose shadow-md" : "border-transparent hover:border-muted-foreground/40"}`}
							whileHover={{ scale: 1.04 }}
							whileTap={{ scale: 0.96 }}
						>
							<Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="25vw" className="object-cover" />
						</motion.button>
					))}
				</div>
			)}
		</motion.div>
	);
}

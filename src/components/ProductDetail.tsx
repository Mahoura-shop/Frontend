"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ArrowLeft } from "lucide-react";
import {
	type Product,
	useProductStore,
} from "../store/productStore/productStore";
import { useTranslation } from "../hooks/useTranslation";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProductDetail({ productId }: { productId: string }) {
	const { products } = useProductStore();
	const product = products.find((product) => product.id === productId);
	const { t, language } = useTranslation();
	const router = useRouter();

	const formatPrice = (price: number) => {
		if (language === "fa") {
			return `${price.toLocaleString("fa-IR")} ${t("currency")}`;
		}
		return `${t("currency")}${(price / 30000).toFixed(2)}`;
	};

	const handleAddToCart = () => {
		toast.success(t("addedToCart"), {
			description: `${product?.name} ${t("addedToCartDesc")}`,
		});
	};

	return (
		<div className="min-h-[calc(100vh-4rem)] py-8">
			<div className="container mx-auto px-4">
				{/* Back Button */}
				<Button
					variant="ghost"
					onClick={() => router.back()}
					className="mb-6"
				>
					<ArrowLeft
						className={
							language === "fa" ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"
						}
					/>
					{t("backToProducts")}
				</Button>

				{/* Product Details */}
				<div className="grid gap-8 lg:grid-cols-2">
					{/* Product Image */}
					<div className="overflow-hidden rounded-lg bg-muted">
						<img
							src={product?.imageUrl}
							alt={product?.name}
							className="h-full w-full object-cover"
							style={{ aspectRatio: "1/1" }}
						/>
					</div>

					{/* Product Info */}
					<div className="flex flex-col">
						<Badge variant="secondary" className="mb-4 w-fit">
							{product?.category}
						</Badge>

						<h1
							className="mb-4 text-primary"
							style={{ fontFamily: "var(--font-serif)" }}
						>
							{product?.name}
						</h1>
						<p
							className="text-primary"
							style={{ fontSize: "1.75rem", fontWeight: 500 }}
						>
							{formatPrice(product?.price || 0)}
						</p>

						<Separator className="my-6" />

						<div className="mb-6">
							<h3 className="mb-2">{t("description")}</h3>
							<p className="text-muted-foreground leading-relaxed">
								{product?.description}
							</p>
						</div>

						<Separator className="my-6" />

						<div className="mb-6 grid grid-cols-2 gap-4">
							<div>
								<p className="mb-1 text-muted-foreground">
									{t("category")}
								</p>
								<p>{product?.category}</p>
							</div>
							<div>
								<p className="mb-1 text-muted-foreground">
									{t("brand")}
								</p>
								<p>{product?.brand}</p>
							</div>
						</div>

						<Button
							size="lg"
							onClick={handleAddToCart}
							className="mt-auto w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
						>
							{t("addToCart")}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

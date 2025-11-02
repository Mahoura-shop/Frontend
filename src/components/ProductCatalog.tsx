"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { useProductStore } from "../store/productStore/productStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";

interface ProductCatalogProps {
	onViewProduct: (id: string) => void;
}

export function ProductCatalog() {
	const { products } = useProductStore();
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedBrand, setSelectedBrand] = useState("all");
	const [sortOrder, setSortOrder] = useState("default");

	const categories = ["all", ...new Set(products.map((p) => p.category))];
	const brands = ["all", ...new Set(products.map((p) => p.brand))];
	const { t, language } = useTranslation();
	const router = useRouter();

	const filteredProducts = products
		.filter(
			(p) => selectedCategory === "all" || p.category === selectedCategory
		)
		.filter((p) => selectedBrand === "all" || p.brand === selectedBrand)
		.sort((a, b) => {
			if (sortOrder === "price-low") return a.price - b.price;
			if (sortOrder === "price-high") return b.price - a.price;
			if (sortOrder === "name") return a.name.localeCompare(b.name);
			return 0;
		});

	const formatPrice = (price: number) => {
		if (language === "fa") {
			return `${price.toLocaleString("fa-IR")} ${t("currency")}`;
		}
		return `${t("currency")}${(price / 30000).toFixed(2)}`;
	};

	return (
		<div className="min-h-[calc(100vh-4rem)] py-8">
			<div className="container mx-auto px-4">
				{/* Page Header */}
				<div className="mb-8">
					<h1
						className="mb-2 text-primary"
						style={{ fontFamily: "var(--font-serif)" }}
					>
						{t("ourCollection")}
					</h1>
					<p className="text-muted-foreground">{t("exploreRange")}</p>
				</div>

				{/* Filters */}
				<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex flex-col gap-4 sm:flex-row">
						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
						>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder={t("category")} />
							</SelectTrigger>
							<SelectContent>
								{categories.map((cat) => (
									<SelectItem key={cat} value={cat}>
										{cat === "all"
											? t("allCategories")
											: cat}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={selectedBrand}
							onValueChange={setSelectedBrand}
						>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder={t("brand")} />
							</SelectTrigger>
							<SelectContent>
								{brands.map((brand) => (
									<SelectItem key={brand} value={brand}>
										{brand === "all"
											? t("allBrands")
											: brand}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<Select value={sortOrder} onValueChange={setSortOrder}>
						<SelectTrigger className="w-full sm:w-[200px]">
							<SelectValue placeholder={t("sortBy")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="default">
								{t("default")}
							</SelectItem>
							<SelectItem value="price-low">
								{t("priceLowToHigh")}
							</SelectItem>
							<SelectItem value="price-high">
								{t("priceHighToLow")}
							</SelectItem>
							<SelectItem value="name">{t("nameAZ")}</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Products Grid */}
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filteredProducts.map((product) => (
						<Card
							key={product.id}
							className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
							onClick={() =>
								router.push(`/products/${product.id}`)
							}
						>
							<div className="aspect-square overflow-hidden bg-muted">
								<img
									src={product.imageUrl}
									alt={product.name}
									className="h-full w-full object-cover transition-transform group-hover:scale-105"
								/>
							</div>
							<CardContent className="p-4">
								<h3 className="mb-2 line-clamp-2">
									{product.name}
								</h3>
								<Badge variant="secondary" className="mb-2">
									{product.category}
								</Badge>
								<p className="text-muted-foreground">
									{product.brand}
								</p>
								<p className="mt-2 text-primary">
									{formatPrice(product.price)}
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				{filteredProducts.length === 0 && (
					<div className="py-16 text-center text-muted-foreground">
						<p>{t("noProductsFound")}</p>
					</div>
				)}
			</div>
		</div>
	);
}

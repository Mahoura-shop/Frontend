import type { Metadata } from "next";
import HeroSection from "@/components/Landing/sections/HeroSection";
import MarqueeSection from "@/components/Landing/sections/MarqueeSection";
import TrustBar from "@/components/Landing/TrustBar/TrustBar";
import CategoriesSection from "@/components/Landing/sections/CategoriesSection";
import ProductsSection from "@/components/Landing/sections/ProductsSection";
import BrandSection from "@/components/Landing/sections/BrandSection";
import NewProductsSection from "@/components/Landing/sections/NewProductsSection";
import BrandsMarquee from "@/components/Landing/sections/BrandsMarquee";
import { getPublicStats, type PublicStats } from "@/services/statsService";
import { productService } from "@/services/productService";
import { getData } from "@/services/services";

export const metadata: Metadata = {
	title: "ماهورا — فروشگاه آرایشی و بهداشتی",
	description:
		"خرید آنلاین بهترین لوازم آرایشی و بهداشتی از برندهای معتبر در ماهورا. کیفیت برتر، قیمت مناسب، ارسال سریع.",
	openGraph: {
		title: "ماهورا — فروشگاه آرایشی و بهداشتی",
		description:
			"خرید آنلاین بهترین لوازم آرایشی و بهداشتی از برندهای معتبر در ماهورا.",
		type: "website",
	},
};

async function fetchStats(): Promise<PublicStats | null> {
	try {
		return await getPublicStats();
	} catch {
		return null;
	}
}

async function fetchProducts(): Promise<Product[]> {
	try {
		const res = await productService.searchProducts({ limit: 12 });
		return res.products;
	} catch {
		return [];
	}
}

async function fetchCategories(): Promise<Category[]> {
	try {
		const res = await getData({ endPoint: "/v1/category" });
		return res?.data ?? [];
	} catch {
		return [];
	}
}

async function fetchBrands(): Promise<Brand[]> {
	try {
		const res = await getData({ endPoint: "/v1/brand" });
		return res?.data ?? [];
	} catch {
		return [];
	}
}

export default async function LandingPage() {
	const [stats, products, categories, brands] = await Promise.all([
		fetchStats(),
		fetchProducts(),
		fetchCategories(),
		fetchBrands(),
	]);

	const newProducts = products.filter((p) => p.isNew).slice(0, 6);

	return (
		<div>
			<HeroSection stats={stats} />
			<MarqueeSection />
			<TrustBar />
			<CategoriesSection categories={categories} />
			<ProductsSection products={products.slice(0, 6)} />
			<BrandSection />
			{newProducts.length > 0 && <NewProductsSection newProducts={newProducts} />}
			<BrandsMarquee brands={brands} />
		</div>
	);
}

"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import SelectFree from "@/components/Custom/Select/SelectFree";
import { formatPrice } from "@/utils/formatPrice";

interface Category { id: number; name: string; }
interface Brand { id: number; name: string; }

export interface FilterPanelProps {
	selectedCategory: string;
	selectedBrand: string;
	priceRange: number[];
	sliderBounds: { min: number; max: number };
	categories: Category[];
	brands: Brand[];
	onCategoryChange: (v: string) => void;
	onBrandChange: (v: string) => void;
	onPriceChange: (v: number[]) => void;
	onClear: () => void;
}

export default function FilterPanel({
	selectedCategory,
	selectedBrand,
	priceRange,
	sliderBounds,
	categories,
	brands,
	onCategoryChange,
	onBrandChange,
	onPriceChange,
	onClear,
}: FilterPanelProps) {
	return (
		<div className="flex flex-col gap-6">
			<h3 className="text-xl font-bold flex items-center gap-2">
				<Filter className="w-5 h-5" />
				فیلترها
			</h3>

			<SelectFree
				value={selectedCategory}
				onValueChange={onCategoryChange}
				label="دسته‌بندی"
				options={[
					{ value: "0", label: "تمام دسته‌بندی‌ها" },
					...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
				]}
			/>

			<SelectFree
				value={selectedBrand}
				onValueChange={onBrandChange}
				label="برند"
				options={[
					{ value: "0", label: "تمام برندها" },
					...brands.map((brand) => ({ value: String(brand.id), label: brand.name })),
				]}
			/>

			<div className="space-y-4">
				<span className="text-sm font-medium">محدوده قیمت</span>
				<Slider value={priceRange} onValueChange={onPriceChange} max={sliderBounds.max} min={sliderBounds.min} step={10000} />
				<div className="grid grid-cols-2 gap-4">
					<div className="p-3 rounded-lg bg-background border text-center">
						<p className="text-xs text-muted-foreground mb-1">حداکثر</p>
						<p className="font-bold text-primary-rose">{formatPrice(priceRange[1])}</p>
						<p className="font-bold text-primary-rose">ریال</p>
					</div>
					<div className="p-3 rounded-lg bg-background border text-center">
						<p className="text-xs text-muted-foreground mb-1">حداقل</p>
						<p className="font-bold text-primary-rose">{formatPrice(priceRange[0])}</p>
						<p className="font-bold text-primary-rose">ریال</p>
					</div>
				</div>
			</div>

			<Button variant="outline" className="w-full" onClick={onClear}>
				پاک کردن فیلترها
			</Button>
		</div>
	);
}

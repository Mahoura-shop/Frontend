"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import InputFree from "@/components/Custom/Input/InputFree";

interface Props {
	searchQuery: string;
	sortBy: string;
	onSearchChange: (v: string) => void;
	onSortChange: (v: string) => void;
	onShowFilters: () => void;
}

export default function ProductsToolbar({ searchQuery, sortBy, onSearchChange, onSortChange, onShowFilters }: Props) {
	return (
		<div className="flex flex-col gap-3 mb-8">
			<div className="flex items-center gap-3">
				<Button variant="outline" className="lg:hidden gap-2 shrink-0" onClick={onShowFilters}>
					<SlidersHorizontal className="w-5 h-5" />
					فیلترها
				</Button>
				<div className="hidden lg:block flex-1">
					<InputFree label="نام محصول یا برند..." icon={Search} value={searchQuery} onValueChange={onSearchChange} inputClassName="pr-10" />
				</div>
				<Select value={sortBy} onValueChange={onSortChange}>
					<SelectTrigger className="flex-1 lg:flex-none lg:w-48 py-2 border rounded-lg bg-background text-foreground">
						<SelectValue placeholder="مرتب سازی" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>مرتب سازی بر اساس</SelectLabel>
							<SelectItem value="newest">جدیدترین</SelectItem>
							<SelectItem value="popularity">پرطرفدارترین</SelectItem>
							<SelectItem value="price-low">ارزان‌ترین</SelectItem>
							<SelectItem value="price-high">گران‌ترین</SelectItem>
						</SelectGroup>
						<SelectItem value="most-visited">پربازدیدترین</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="lg:hidden">
				<InputFree label="نام محصول یا برند..." icon={Search} value={searchQuery} onValueChange={onSearchChange} inputClassName="pr-10" />
			</div>
		</div>
	);
}

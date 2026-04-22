import { getData } from "@/services/services";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CategoryStore {
	categories: Category[];
	fetchCategories: () => void;
}

export const useCategoryStore = create<CategoryStore>()(
	persist(
		(set) => ({
			categories: [],
			fetchCategories: () => {
				getData({ endPoint: `/v1/category` }).then((data) => {
					const categories = data?.data ?? [];
					set((prev) => ({ ...prev, categories }));
				});
			},
		}),
		{
			name: "category-store",
		},
	),
);

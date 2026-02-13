import { getData } from "@/services/services";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStore {
	products: Product[];
	fetchProducts: () => void;
}

export const useProductStore = create<ProductStore>()(
	persist(
		(set) => ({
			products: [],
			fetchProducts: () => {
				getData({ endPoint: `/v1/product` }).then((data) => {
					const products = data?.data ?? [];
					set((prev) => ({ ...prev, products }));
				});
			},
		}),
		{
			name: "product-store",
		},
	),
);

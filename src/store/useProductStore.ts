import { getData } from "@/services/services";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStore {
	products: Product[];
	fetchProducts: () => Promise<Product[]>;
}

export const useProductStore = create<ProductStore>()(
	persist(
		(set) => ({
			products: [],
			fetchProducts: async () => {
				const data = await getData({ endPoint: `/v1/product` });
				const products = data?.data ?? [];
				set({ products });
				return products;
			},
		}),
		{
			name: "product-store",
		},
	),
);

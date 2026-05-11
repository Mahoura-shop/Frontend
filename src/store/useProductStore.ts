import { productService, type ProductSearchParams } from "@/services/productService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStore {
	products: Product[];
	totalCount: number;
	fetchProducts: (params?: ProductSearchParams) => Promise<Product[]>;
}

export const useProductStore = create<ProductStore>()(
	persist(
		(set) => ({
			products: [],
			totalCount: 0,
			fetchProducts: async (params?: ProductSearchParams) => {
				const response = await productService.searchProducts(params || {});
				set({ products: response.products, totalCount: response.totalCount });
				return response.products;
			},
		}),
		{
			name: "product-store",
		},
	),
);

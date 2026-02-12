import { getData } from "@/services/services";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStore {
	products: Product[];
	getProducts: () => void;
}

export const useProductStore = create<ProductStore>()(
	persist(
		(set) => ({
			products: [],
			getProducts: () => {
				getData({ endPoint: `/v1/product` }).then((data) => {
					const products = data?.data ?? [];
					console.log(products);
					set({
						products: products,
					});
				});
			},
		}),
		{
			name: "mahoura-store",
		},
	),
);

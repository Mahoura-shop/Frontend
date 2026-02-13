import { getData } from "@/services/services";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BrandStore {
	brands: Brand[];
	fetchBrands: () => void;
}

export const useBrandStore = create<BrandStore>()(
	persist(
		(set) => ({
			brands: [],
			fetchBrands: () => {
				getData({ endPoint: `/v1/brand` }).then((data) => {
					const brands = data?.data ?? [];
					set((prev) => ({ ...prev, brands }));
				});
			},
		}),
		{
			name: "brand-store",
		},
	),
);

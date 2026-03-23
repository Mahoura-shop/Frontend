import { getData } from "@/services/services";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyStore {
	currencies: Currency[];
	fetchCurrencies: () => Promise<Currency[]>;
}

export const useCurrencyStore = create<CurrencyStore>()(
	persist(
		(set) => ({
			currencies: [],
			fetchCurrencies: async () => {
				const data = await getData({ endPoint: `/v1/currency` });
				const currencies = data?.data ?? [];
				set({ currencies });
				return currencies;
			},
		}),
		{
			name: "currency-store",
		},
	),
);

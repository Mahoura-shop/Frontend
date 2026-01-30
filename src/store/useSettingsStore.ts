import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CurrencyRate {
  code: string;
  name: string;
  nameFa: string;
  rate: number; // Rate to IRR
  symbol: string;
}

interface SettingsStore {
  currencyRates: CurrencyRate[];
  updateRate: (code: string, rate: number) => void;
  convertToIRR: (price: number, currency: string) => number;
  formatPrice: (price: number) => string;
}

const defaultRates: CurrencyRate[] = [
  { code: 'IRR', name: 'Iranian Rial', nameFa: 'ریال ایران', rate: 1, symbol: '﷼' },
  { code: 'USD', name: 'US Dollar', nameFa: 'دلار آمریکا', rate: 50000, symbol: '$' },
  { code: 'EUR', name: 'Euro', nameFa: 'یورو', rate: 55000, symbol: '€' },
  { code: 'GBP', name: 'British Pound', nameFa: 'پوند انگلیس', rate: 65000, symbol: '£' },
  { code: 'AED', name: 'UAE Dirham', nameFa: 'درهم امارات', rate: 13600, symbol: 'د.إ' },
  { code: 'TRY', name: 'Turkish Lira', nameFa: 'لیر ترکیه', rate: 1700, symbol: '₺' },
];

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      currencyRates: defaultRates,

      updateRate: (code, rate) => {
        set((state) => ({
          currencyRates: state.currencyRates.map((curr) =>
            curr.code === code ? { ...curr, rate } : curr
          ),
        }));
      },

      convertToIRR: (price, currency) => {
        const { currencyRates } = get();
        const currencyData = currencyRates.find((c) => c.code === currency);
        if (!currencyData) return price;
        return Math.round(price * currencyData.rate);
      },

      formatPrice: (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
      },
    }),
    {
      name: 'mahoura-settings',
    }
  )
);

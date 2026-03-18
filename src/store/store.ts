import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../utils/translations';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  brand: string;
}

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
}

interface UIState {
  isDarkMode: boolean;
  language: Language;
  currentPage: string;
  selectedProductId: string | null;
  toggleDarkMode: () => void;
  setLanguage: (lang: Language) => void;
  setCurrentPage: (page: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [
        {
          id: "1",
          name: "سرم درخشان‌کننده پوست",
          price: 2500000,
          description: "سرم لوکس صورت غنی شده با ویتامین C و هیالورونیک اسید. آبرسانی عمیق به پوست در عین روشن‌سازی رنگ پوست برای درخشش جوان و شاداب.",
          imageUrl: "https://images.unsplash.com/photo-1630398777649-cdfc7c5e8a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBza2luY2FyZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzYyMTE0NjQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          category: "مراقبت پوست",
          brand: "ماهورا",
        },
        {
          id: "2",
          name: "پالت سایه چشم مخملی",
          price: 1800000,
          description: "مجموعه‌ای نفیس از ۱۲ رنگ بسیار پرپیگمنت از رنگ‌های ملایم خنثی تا رنگ‌های جسورانه. مناسب برای آرایش‌های روزمره و شیک.",
          imageUrl: "https://images.unsplash.com/photo-1722505492186-ceba8a24d3f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpYyUyMG1ha2V1cCUyMHBhbGV0dGV8ZW58MXx8fHwxNzYyMTE0NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          category: "آرایش",
          brand: "زیبایی لوکس",
        },
        {
          id: "3",
          name: "ادوپرفیوم رز نیمه‌شب",
          price: 3500000,
          description: "عطری جذاب که جوهره گل‌های نیمه‌شب را به تصویر می‌کشد. نت‌های رز، یاس و چوب صندل رایحه‌ای پیچیده و جاودانه ایجاد می‌کنند.",
          imageUrl: "https://images.unsplash.com/photo-1680789526882-8042f7fd0a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlJTIwbHV4dXJ5fGVufDF8fHx8MTc2MjAxOTk3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          category: "عطر و ادکلن",
          brand: "الگانس",
        },
        {
          id: "4",
          name: "رژ لب ابریشمی",
          price: 1200000,
          description: "رژ لب فوق‌العاده نرم با فینیش ساتین که به راحتی روی لب‌ها می‌آید. فرمول بادوام غنی شده با روغن‌های مغذی برای راحتی تمام روز.",
          imageUrl: "https://images.unsplash.com/photo-1631214499887-88e7084d7f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXBzdGlja3xlbnwxfHx8fDE3NjIxMTQ2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          category: "آرایش",
          brand: "ماهورا",
        },
        {
          id: "5",
          name: "کرم آبرسان فشرده",
          price: 2200000,
          description: "کرم غنی و مغذی صورت که آبرسانی ۲۴ ساعته را فراهم می‌کند. فرموله شده با پپتیدها و سرامیدها برای تقویت سد پوستی و کاهش خطوط ریز.",
          imageUrl: "https://images.unsplash.com/photo-1667242003558-e42942d2b911?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNlJTIwY3JlYW0lMjBqYXJ8ZW58MXx8fHwxNzYyMDg0MjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          category: "مراقبت پوست",
          brand: "رادیانس",
        },
        {
          id: "6",
          name: "ست کامل آرایش چشم درخشان",
          price: 2600000,
          description: "ست کامل آرایش چشم شامل سایه چشم، خط چشم و ریمل. با این مجموعه منتخب از محصولات ممتاز، آرایش‌های چشم خیره‌کننده بسازید.",
          imageUrl: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVzaGFkb3clMjBwYWxldHRlfGVufDF8fHx8MTc2MjA5ODE3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          category: "آرایش",
          brand: "زیبایی لوکس",
        },
      ],
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...product, id: Date.now().toString() },
          ],
        })),
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products?.map((p) =>
            p.id === id ? { ...product, id } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'mahoura-products',
    }
  )
);

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      language: 'fa',
      currentPage: 'home',
      selectedProductId: null,
      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
      setLanguage: (lang) => set({ language: lang }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setSelectedProductId: (id) => set({ selectedProductId: id }),
    }),
    {
      name: 'mahoura-ui',
    }
  )
);

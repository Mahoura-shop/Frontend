import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  name: string;
  nameEn?: string;
  brand: string;
  category: string;
  price: number;
  priceFormatted: string;
  description: string;
  ingredients?: string[];
  howToUse?: string;
  image: string;
  images?: string[];
  isNew: boolean;
  available: boolean;
  stock?: number;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
  benefits?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface ProductStore {
  products: Product[];
  cart: CartItem[];
  wishlist: number[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (productId: number) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

// Sample product data
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'رژ لب مات شماره ۱',
    nameEn: 'Matte Lipstick #1',
    brand: 'Mahoura Signature',
    category: 'آرایش صورت',
    price: 299000,
    priceFormatted: '۲۹۹,۰۰۰',
    description: 'رژ لب مات با ماندگاری بالا و بافت نرم و مخملی. این محصول با فرمول منحصر به فرد خود، لب‌های شما را برای ساعت‌های طولانی رنگی و زیبا نگه می‌دارد.',
    ingredients: ['ویتامین E', 'روغن آرگان', 'شی باتر'],
    howToUse: 'رژ لب را از مرکز لب به سمت گوشه‌ها اعمال کنید. برای رنگی عمیق‌تر، لایه دوم اعمال کنید.',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1631214460245-0e9b29740c17?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop',
    ],
    isNew: true,
    available: true,
    stock: 45,
    rating: 4.8,
    reviews: 127,
    colors: ['قرمز', 'صورتی', 'نود', 'مرجانی'],
    benefits: ['ماندگاری ۱۲ ساعته', 'مرطوب کننده', 'بدون خشکی', 'ضد آب'],
  },
  {
    id: 2,
    name: 'سرم ویتامین C روشن کننده',
    nameEn: 'Vitamin C Brightening Serum',
    brand: 'Mahoura Care',
    category: 'مراقبت از پوست',
    price: 450000,
    priceFormatted: '۴۵۰,۰۰۰',
    description: 'سرم قدرتمند ویتامین C با غلظت بالا برای روشن‌سازی و یکنواخت کردن رنگ پوست. این سرم با فرمول پیشرفته خود، لک‌های پوستی را کاهش داده و به پوست درخشندگی طبیعی می‌بخشد.',
    ingredients: ['ویتامین C ۲۰٪', 'هیالورونیک اسید', 'ویتامین E', 'نیاسینامید'],
    howToUse: 'روزانه صبح و شب، ۳-۴ قطره روی پوست تمیز اعمال کنید. سپس کرم مرطوب کننده بزنید.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop',
    ],
    isNew: true,
    available: true,
    stock: 32,
    rating: 4.9,
    reviews: 203,
    sizes: ['۳۰ میلی‌لیتر', '۵۰ میلی‌لیتر'],
    benefits: ['روشن کننده', 'ضد لک', 'آنتی اکسیدان', 'ضد چروک'],
  },
  {
    id: 3,
    name: 'پالت سایه چشم ۱۲ رنگ',
    nameEn: '12 Color Eyeshadow Palette',
    brand: 'Mahoura Pro',
    category: 'آرایش چشم',
    price: 350000,
    priceFormatted: '۳۵۰,۰۰۰',
    description: 'پالت سایه چشم حرفه‌ای با ۱۲ رنگ متنوع از مات تا شیمر. این پالت برای ایجاد آرایش‌های روزانه تا مهمانی طراحی شده است.',
    ingredients: ['میکا', 'تالک', 'روغن آرگان'],
    howToUse: 'با براش سایه، رنگ مورد نظر را برداشته و روی پلک اعمال کنید.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583241800698-9c0e51c3d677?w=800&h=800&fit=crop',
    ],
    isNew: false,
    available: false,
    stock: 0,
    rating: 4.7,
    reviews: 89,
    benefits: ['پیگمنتاسیون بالا', 'بدون ریزش', 'ماندگاری طولانی'],
  },
  {
    id: 4,
    name: 'کرم مرطوب کننده هیالورونیک',
    nameEn: 'Hyaluronic Moisturizing Cream',
    brand: 'Mahoura Care',
    category: 'مراقبت از پوست',
    price: 320000,
    priceFormatted: '۳۲۰,۰۰۰',
    description: 'کرم مرطوب کننده عمیق با هیالورونیک اسید برای آبرسانی و نرمی پوست.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop',
    isNew: true,
    available: true,
    stock: 60,
    rating: 4.6,
    reviews: 145,
  },
  {
    id: 6,
    name: 'هایلایتر طلایی',
    nameEn: 'Golden Highlighter',
    brand: 'Mahoura Pro',
    category: 'آرایش صورت',
    price: 380000,
    priceFormatted: '۳۸۰,۰۰۰',
    description: 'هایلایتر طلایی برای درخشش و برجستگی نقاط مورد نظر صورت.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop',
    isNew: false,
    available: true,
    stock: 25,
    rating: 4.8,
    reviews: 92,
  },
];

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: sampleProducts,
      cart: [],
      wishlist: [],

      addToCart: (product, quantity = 1, size, color) => {
        const { cart } = get();
        const existingItem = cart.find(
          (item) =>
            item.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor === color
        );

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            cart: [...cart, { ...product, quantity, selectedSize: size, selectedColor: color }],
          });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      addToWishlist: (productId) => {
        const { wishlist } = get();
        if (!wishlist.includes(productId)) {
          set({ wishlist: [...wishlist, productId] });
        }
      },

      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter((id) => id !== productId) });
      },

      toggleWishlist: (productId) => {
        const { wishlist } = get();
        if (wishlist.includes(productId)) {
          get().removeFromWishlist(productId);
        } else {
          get().addToWishlist(productId);
        }
      },

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartItemsCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'mahoura-store',
    }
  )
);

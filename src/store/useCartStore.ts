import { create } from "zustand";
import { getCart, addToCart, removeFromCart } from "@/services/cartService";
import { toast } from "sonner";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";

interface CartProduct {
	id: number;
	name: string;
	slug: string;
	irrPrice: number;
	consumerPrice: number;
	step1Price: number;
	step2Price: number;
	step3Price: number;
	step4Price: number;
	productPic: string;
	brand: { name: string } | null;
	isNew: boolean;
}

export interface CartItem {
	id: number;
	product: CartProduct;
	count: number;
}

interface CartStore {
	items: CartItem[];
	loading: boolean;
	fetchCart: () => Promise<void>;
	addItem: (productID: number) => Promise<void>;
	removeItem: (productID: number) => Promise<void>;
	removeAllOfItem: (productID: number, count: number) => Promise<void>;
	clearCart: () => Promise<void>;
	getItemCount: () => number;
	getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
	items: [],
	loading: false,

	fetchCart: async () => {
		set({ loading: true });
		try {
			const res = await getCart();
			set({ items: res.data?.items ?? [] });
		} catch {
			set({ items: [] });
		} finally {
			set({ loading: false });
		}
	},

	addItem: async (productID: number) => {
		const prev = get().items;
		const existing = prev.find((i) => i.product.id === productID);
		if (existing) {
			set({
				items: prev.map((i) =>
					i.product.id === productID
						? { ...i, count: i.count + 1 }
						: i,
				),
			});
		}
		try {
			await addToCart(productID).then((data) => {
				CustomToast(data.message, "success");
			});
			await get().fetchCart();
		} catch {
			set({ items: prev });
			CustomToast("افزودن به سبد خرید با خطا مواجه شد", "error");
		}
	},

	removeItem: async (productID: number) => {
		const prev = get().items;
		set({
			items: prev
				.map((i) =>
					i.product.id === productID
						? { ...i, count: i.count - 1 }
						: i,
				)
				.filter((i) => i.count > 0),
		});
		try {
			await removeFromCart(productID).then((data) => {
				CustomToast(data.message, "success");
			});
			await get().fetchCart();
		} catch {
			set({ items: prev });
			CustomToast("حذف از سبد خرید با خطا مواجه شد", "error");
		}
	},

	removeAllOfItem: async (productID: number, count: number) => {
		const prev = get().items;
		set({ items: prev.filter((i) => i.product.id !== productID) });
		try {
			for (let i = 0; i < count; i++) {
				await removeFromCart(productID);
			}
			await get().fetchCart();
		} catch {
			set({ items: prev });
		}
	},

	clearCart: async () => {
		const prev = get().items;
		set({ items: [] });
		try {
			for (const item of prev) {
				for (let i = 0; i < item.count; i++) {
					await removeFromCart(item.product.id);
				}
			}
			await get().fetchCart();
		} catch {
			set({ items: prev });
		}
	},

	getItemCount: () => get().items.reduce((sum, item) => sum + item.count, 0),

	getTotalPrice: () =>
		get().items.reduce(
			(sum, item) => sum + (item.product.irrPrice ?? 0) * item.count,
			0,
		),
}));

// src/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
	id: number;
	name: string;
	slug: string;
	price: number;
	image: string;
	brand: string;
	quantity: number;
	isNew?: boolean;
}

interface CartStore {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity">) => void;
	removeItem: (id: number) => void;
	updateQuantity: (id: number, quantity: number) => void;
	clearCart: () => void;
	getItemCount: () => number;
	getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],

			addItem: (item) => {
				const existingItem = get().items.find((i) => i.id === item.id);

				if (existingItem) {
					set({
						items: get().items.map((i) =>
							i.id === item.id
								? { ...i, quantity: i.quantity + 1 }
								: i,
						),
					});
				} else {
					set({ items: [...get().items, { ...item, quantity: 1 }] });
				}
			},

			removeItem: (id) => {
				set({ items: get().items.filter((i) => i.id !== id) });
			},

			updateQuantity: (id, quantity) => {
				if (quantity < 1) return;

				set({
					items: get().items.map((i) =>
						i.id === id ? { ...i, quantity } : i,
					),
				});
			},

			clearCart: () => {
				set({ items: [] });
			},

			getItemCount: () => {
				return get().items.reduce(
					(sum, item) => sum + item.quantity,
					0,
				);
			},

			getTotalPrice: () => {
				return get().items.reduce(
					(sum, item) => sum + item.price * item.quantity,
					0,
				);
			},
		}),
		{
			name: "cart-storage",
		},
	),
);

import { create } from "zustand"
import { getCart, addToCart, removeFromCart } from "@/services/cartService"

interface CartProduct {
	id: number
	name: string
	slug: string
	irrPrice: number
	productPic: string
	brand: { name: string } | null
	isNew: boolean
}

export interface CartItem {
	id: number
	product: CartProduct
	count: number
}

interface CartStore {
	items: CartItem[]
	loading: boolean
	fetchCart: () => Promise<void>
	addItem: (productID: number) => Promise<void>
	removeItem: (productID: number) => Promise<void>
	removeAllOfItem: (productID: number, count: number) => Promise<void>
	clearCart: () => Promise<void>
	getItemCount: () => number
	getTotalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
	items: [],
	loading: false,

	fetchCart: async () => {
		set({ loading: true })
		try {
			const res = await getCart()
			set({ items: res.data?.items ?? [] })
		} catch {
			set({ items: [] })
		} finally {
			set({ loading: false })
		}
	},

	addItem: async (productID: number) => {
		await addToCart(productID)
		await get().fetchCart()
	},

	removeItem: async (productID: number) => {
		await removeFromCart(productID)
		await get().fetchCart()
	},

	removeAllOfItem: async (productID: number, count: number) => {
		for (let i = 0; i < count; i++) {
			await removeFromCart(productID)
		}
		await get().fetchCart()
	},

	clearCart: async () => {
		const items = get().items
		for (const item of items) {
			for (let i = 0; i < item.count; i++) {
				await removeFromCart(item.product.id)
			}
		}
		await get().fetchCart()
	},

	getItemCount: () => get().items.reduce((sum, item) => sum + item.count, 0),

	getTotalPrice: () =>
		get().items.reduce((sum, item) => sum + (item.product.irrPrice ?? 0) * item.count, 0),
}))

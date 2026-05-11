import { getData, postData, deleteData } from "./services"

export const getWishlist = () => getData({ endPoint: "v1/wishlist" })

export const addToWishlist = (productID: number) =>
	postData({ endPoint: `v1/wishlist/${productID}`, data: {} })

export const removeFromWishlist = (productID: number) =>
	deleteData({ endPoint: `v1/wishlist/${productID}`, data: {} })

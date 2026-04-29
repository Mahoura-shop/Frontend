import { getData, postData } from "./services"

export const getCart = () => getData({ endPoint: "v1/cart" })

export const addToCart = (productID: number) =>
	postData({ endPoint: `v1/cart/${productID}/add` })

export const removeFromCart = (productID: number) =>
	postData({ endPoint: `v1/cart/${productID}/remove` })

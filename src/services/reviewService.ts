import { getData, postData } from "./services"

export const getProductReviews = (productID: number) =>
	getData({ endPoint: `v1/products/${productID}/reviews` })

export const submitReview = (productID: number, rating: number, comment: string) =>
	postData({ endPoint: `v1/products/${productID}/review`, data: { rating, comment } })

export const getMyReviews = () =>
	getData({ endPoint: "v1/reviews" })

import { getData, postData } from "./services"

export interface CreateAddressPayload {
	provinceID: number
	cityID: number
	streetAddress: string
	postalCode: string
	houseNumber: string
	unit: number
}

export const getAddresses = () => getData({ endPoint: "v1/address" })

export const createAddress = (data: CreateAddressPayload) =>
	postData({ endPoint: "v1/address", data })

export const getProvinces = () => getData({ endPoint: "v1/province" })

export const getCities = (provinceID: number) =>
	getData({ endPoint: `v1/province/${provinceID}/cities` })

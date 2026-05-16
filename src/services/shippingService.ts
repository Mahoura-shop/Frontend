import { getData } from "./services";

export const getShippingCost = async (): Promise<number> => {
	const res = await getData({ endPoint: "v1/shipping" });
	return res.data.shippingCost as number;
};

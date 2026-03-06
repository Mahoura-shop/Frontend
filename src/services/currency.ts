import { getData } from "./services";

export const getCurrencies = () => {
	return getData({ endPoint: `/v1/currency` });
};

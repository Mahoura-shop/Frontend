import { getData } from "./services";

export interface PublicStats {
	productsCount: number;
	brandsCount: number;
	usersCount: number;
}

export const getPublicStats = async (): Promise<PublicStats> => {
	const res = await getData({ endPoint: "v1/stats" });
	return res.data as PublicStats;
};

import { getData, patchData, postData } from "./services";

export interface ProductSearchParams {
	q?: string;
	categoryID?: number;
	brandID?: number;
	minPrice?: number;
	maxPrice?: number;
	inStock?: boolean;
	sortBy?: string;
	limit?: number;
	offset?: number;
}

export interface ProductSearchResponse {
	products: Product[];
	totalCount: number;
}

export interface ProductPrice {
	id: number;
	irrPrice: number;
}

export const productService = {
	async searchProducts(
		params: ProductSearchParams,
	): Promise<ProductSearchResponse> {
		const queryParams: Record<string, any> = {};

		if (params.q) queryParams.q = params.q;
		if (params.categoryID) queryParams.categoryID = params.categoryID;
		if (params.brandID) queryParams.brandID = params.brandID;
		if (params.minPrice) queryParams.minPrice = params.minPrice;
		if (params.maxPrice) queryParams.maxPrice = params.maxPrice;
		if (params.inStock !== undefined) queryParams.inStock = params.inStock;
		if (params.sortBy) queryParams.sortBy = params.sortBy;
		if (params.limit) queryParams.limit = params.limit;
		if (params.offset) queryParams.offset = params.offset;

		try {
			const response = await getData({
				endPoint: "/v1/products",
				params: queryParams,
			});

			return {
				products: response?.data?.products ?? [],
				totalCount: response?.data?.totalCount ?? 0,
			};
		} catch {
			return { products: [], totalCount: 0 };
		}
	},

	async updateProductPrices(productPrices: ProductPrice[]) {
		return patchData({
			endPoint: "/v1/admin/product/prices",
			data: { productPrices },
		});
	},

	async batchUpdateStock(
		type: "buy" | "sell",
		items: Array<{ productID: number; count: number }>,
	) {
		return postData({
			endPoint: "/v1/product/stock",
			data: { type, items },
		});
	},

	async uploadInventoryExcel(file: File): Promise<{ updated: number }> {
		const XLSX = await import("xlsx");
		const buffer = await file.arrayBuffer();
		const workbook = XLSX.read(buffer);
		const sheet = workbook.Sheets[workbook.SheetNames[0]];

		const rawData = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
			header: 1,
		});
		if (rawData.length < 2) throw new Error("فایل اکسل خالی است");

		const headers = (rawData[0] as unknown[]).map((h) =>
			String(h ?? "")
				.trim()
				.toLowerCase(),
		);
		const idCol = headers.indexOf("id");
		const invCol = headers.indexOf("inventory");

		if (idCol === -1 || invCol === -1) {
			throw new Error("ستون‌های id و inventory در فایل یافت نشد");
		}

		const rows = (rawData.slice(1) as unknown[][])
			.map((row) => ({
				externalID: String(row[idCol] ?? "").trim(),
				quantity: Number(row[invCol]),
			}))
			.filter(
				(r) =>
					r.externalID !== "" &&
					!isNaN(r.quantity) &&
					r.quantity >= 0,
			);

		if (rows.length === 0)
			throw new Error("هیچ ردیف معتبری در فایل یافت نشد");
		const res = await postData({
			endPoint: "/v1/product/inventory/excel",
			data: { rows },
		});
		console.log(res);
		return res?.data ?? { updated: 0 };
	},
};

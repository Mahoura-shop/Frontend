import { getData, patchData, postData } from "./services";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

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

			const products = response?.data?.products ?? [];
			if (products.length > 0) {
				return {
					products,
					totalCount: response?.data?.totalCount ?? 0,
				};
			}
		} catch {
			// backend unavailable — fall through to mock
		}

		let mock = [...MOCK_PRODUCTS];
		if (params.q) {
			const q = params.q.toLowerCase();
			mock = mock.filter(
				(p) =>
					p.name.includes(params.q!) ||
					p.brand?.name?.toLowerCase().includes(q),
			);
		}
		if (params.categoryID)
			mock = mock.filter((p) => p.category?.id === params.categoryID);
		if (params.brandID)
			mock = mock.filter((p) => p.brand?.id === params.brandID);
		if (params.minPrice)
			mock = mock.filter((p) => (p.irrPrice ?? 0) >= params.minPrice!);
		if (params.maxPrice)
			mock = mock.filter((p) => (p.irrPrice ?? 0) <= params.maxPrice!);
		if (params.sortBy === "price_asc")
			mock.sort((a, b) => (a.irrPrice ?? 0) - (b.irrPrice ?? 0));
		if (params.sortBy === "price_desc")
			mock.sort((a, b) => (b.irrPrice ?? 0) - (a.irrPrice ?? 0));
		const offset = params.offset ?? 0;
		const limit = params.limit ?? 12;
		return {
			products: mock.slice(offset, offset + limit),
			totalCount: mock.length,
		};
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

import { getData, patchData } from "./services";

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

    const response = await getData({
      endPoint: "/v1/products",
      params: queryParams,
    });

    return {
      products: response?.data?.products ?? [],
      totalCount: response?.data?.totalCount ?? 0,
    };
  },

  async updateProductPrices(productPrices: ProductPrice[]) {
    return patchData({
      endPoint: "/v1/admin/product/prices",
      data: { productPrices },
    });
  },
};

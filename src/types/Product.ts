import { Brand } from "./Brand";
import { Category } from "./Category";

export interface Product {
	id: number;
	name: string;
	slug: string;
	price: number;
	description?: string;
	isActive: boolean;
	isNew: boolean;
	priority: number;
	minOrder: number;
	category: Category;
	brand: Brand;
	quantity: number;
	quantityType: string;
	currencyCode: string;
	productPic: string;
}

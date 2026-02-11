interface Product {
	id: number;
	name: string;
	slug: string;
	price: number;
	description?: string;
	isActive: boolean;
	isNew: boolean;
	priority: number;
	minOrder: number;
	category?: Category;
	categoryID?: string;
	brandID?: string;
	brand?: Brand;
	quantity: number;
	quantityType: string;
	currencyCode: string;
	productPic: string | undefined;
}

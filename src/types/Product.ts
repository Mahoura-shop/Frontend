interface Product {
	id: number;
	name: string;
	slug: string;
	price?: number;
	description?: string;
	isActive: boolean;
	isNew: boolean;
	priority: number;
	minOrder: number;
	category?: Category;
	categoryID?: string;
	irrPrice?: number;
	consumerPrice?: number;
	step1Percent?: number;
	step2Percent?: number;
	step3Percent?: number;
	step1Price?: number;
	step2Price?: number;
	step3Price?: number;
	brandID?: string;
	brand?: Brand;
	quantity: number;
	quantityType: string;
	currency?: Currency;
	currencyID: string;
	productPic: string | undefined;
}

interface ProductPrice {
	id: number;
	name: string;
	price: number;
	irrPrice: number;
	currency: Currency;
	newIrrPrice: number;
}
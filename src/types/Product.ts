interface Product {
	id: number;
	name: string;
	slug: string;
	price: number;
	description?: string;
	offer?: string;
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
	step4Percent?: number;
	step1Price?: number;
	step2Price?: number;
	step3Price?: number;
	step4Price?: number;
	step1Origin?: boolean;
	step2Origin?: boolean;
	step3Origin?: boolean;
	step4Origin?: boolean;
	brandID?: string;
	brand?: Brand;
	quantity: number;
	quantityType: string;
	currency: Currency;
	currencyID: string;
	productPic: string | undefined;
	images?: string[];
	imageObjects?: { id: number; path: string }[];
	resolvedPrice?: number;
	averageRating?: number;
	reviewCount?: number;
}

interface ProductPrice {
	id: number;
	name: string;
	price: number;
	irrPrice: number;
	currency: Currency;
	newIrrPrice: number;
}
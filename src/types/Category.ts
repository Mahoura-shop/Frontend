interface Category {
	id: number;
	name: string;
	slug: string;
	description?: string;
	categoryPic: string | null;
	count: number;
	isActive: boolean;
	products?: Product[];
}

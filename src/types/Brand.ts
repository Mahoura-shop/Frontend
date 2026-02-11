interface Brand {
	id: number;
	name: string;
	slug: string;
	description?: string;
	brandPic: string | null;
	count: number;
	isActive: boolean;
}

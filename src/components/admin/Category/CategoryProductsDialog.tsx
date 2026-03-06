"use client";
import { useCallback, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getData } from "@/services/services";
import Button from "@/components/Custom/Button/Button";
import ProductInfoDialog from "../Product/ProductInfoDialog";
import Loading from "@/components/Loading/Loading";

export default function CategoryProductsDialog({
	category,
}: {
	category: Category;
}) {
	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);

	const fetchCategoryProducts = useCallback((categoryID: number) => {
		setLoading(true);
		getData({ endPoint: `/v1/product/category/${categoryID}` })
			.then((data) => {
				setCategoryProducts(data?.data ?? []);
				console.log("fetchCategoryProducts", data?.data ?? []);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetchCategoryProducts(category.id);
	}, []);

	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				setOpen(val);
			}}
		>
			<DialogTrigger>
				<Button variant="ghost" size="sm" className="h-8">
					مشاهده محصولات
				</Button>
			</DialogTrigger>
			<DialogContent className="py-4">
				{loading ? (
					<Loading />
				) : (
					<>
						<DialogHeader>
							<DialogTitle>
								محصولات دسته‌بندی {category?.name}
							</DialogTitle>
						</DialogHeader>
						{categoryProducts && categoryProducts.length > 0 ? (
							categoryProducts.map((product) => (
								<ProductInfoDialog
									product={product}
									variant="name"
								/>
							))
						) : (
							<div className="flex justify-center items-center text-2xl w-full min-h-[50vh]">
								هیچ محصولی یافت نشد.
							</div>
						)}
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

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
import StickyDialogFooter from "@/components/StickyDialogFooter/StickyDialogFooter";

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
			<DialogContent variant="action">
				<DialogHeader>
					<DialogTitle>
						محصولات دسته‌بندی {category?.name}
					</DialogTitle>
				</DialogHeader>
				{loading ? (
					<Loading />
				) : categoryProducts && categoryProducts.length > 0 ? (
					<>
						{categoryProducts?.map((product, index) => (
							<ProductInfoDialog
                                key={index}
								product={product}
								variant="name"
							/>
						))}
						<StickyDialogFooter>
							{/* <Button
								variant="primary"
								loading={loading}
							>
								تغییر قیمت
							</Button> */}
                            {/* <CategoryPriceUpdateDialog category={category} products={categoryProducts} /> */}
						</StickyDialogFooter>
					</>
				) : (
				)}
			</DialogContent>
		</Dialog>
	);
}

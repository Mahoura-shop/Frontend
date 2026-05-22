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

export default function BrandProductsDialog({ brand }: { brand: Brand }) {
	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [brandProducts, setBrandProducts] = useState<Product[]>([]);

	const fetchBrandProducts = useCallback((brandID: number) => {
		setLoading(true);
		getData({ endPoint: `/v1/product?brandID=${brandID}` })
			.then((data) => {
				setBrandProducts(data?.data ?? []);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetchBrandProducts(brand.id);
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
					<DialogTitle>محصولات برند {brand?.name}</DialogTitle>
				</DialogHeader>
				{loading ? (
					<Loading />
				) : brandProducts && brandProducts.length > 0 ? (
					<>
						{brandProducts?.map((product, index) => (
							<ProductInfoDialog
								key={index}
								product={product}
								variant="name"
							/>
						))}
						<StickyDialogFooter />
					</>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

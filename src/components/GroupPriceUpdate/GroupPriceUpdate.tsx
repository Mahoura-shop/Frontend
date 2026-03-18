"use client";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/components/Custom/Button/Button";
import StickyDialogFooter from "@/components/StickyDialogFooter/StickyDialogFooter";
import InputFree from "@/components/Custom/Input/InputFree";
import { DollarSign, FolderTree } from "lucide-react";
import { getCurrencies } from "@/services/currency";
import Loading from "@/components/Loading/Loading";
import ProductInfoDialog from "../admin/Product/ProductInfoDialog";
import CurrencyConvertRatesDialog from "../admin/Currency/CurrencyConvertRatesDialog";

export default function GroupPriceUpdate({
	name,
	variant = "default",
	products,
}: {
	name: string;
	products?: Product[];
	variant?: "default" | "icon";
}) {
	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	// const [currencies, setCurrencies] = useState<Currency[]>([]);
	const [newProducts, setNewProducts] = useState<Product[]>([]);

	useEffect(() => {
		setLoading(true);
		console.log("products", products);
		getCurrencies()
			.then((data) => {
				const currencies = data?.data;
				setNewProducts(
					data?.data?.map((product: Product) => ({
						...product,
						irrPrice:
							Number(product.price) *
							currencies.find(
								(currency: Currency) =>
									currency.id === Number(product.currencyID),
							)?.convertRate,
					})),
				);
			})
			.finally(() => setLoading(false));
	}, []);

	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				setOpen(val);
			}}
		>
			<DialogTrigger>
				{variant === "default" ? (
					<Button variant="ghost" size="sm" className="h-8">
						مشاهده محصولات
					</Button>
				) : (
					<Button
						size="icon"
						variant="secondary"
						className="h-8 w-8 hover:bg-background/80"
					>
						<FolderTree />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent variant="action" className="max-w-6xl">
				<DialogHeader>
					<DialogTitle>محصولات {name}</DialogTitle>
				</DialogHeader>
				{loading ? (
					<Loading />
				) : products && products.length > 0 ? (
					products?.map((product, index) => (
						<div className="grid grid-cols-5 gap-2" key={index}>
							<ProductInfoDialog
								product={product}
								variant="name"
								className="col-span-2"
							/>
							<InputFree
								label={`قیمت اصلی (${product?.currency?.name})`}
								containerClassName="col-span-1"
								value={product.price}
								icon={DollarSign}
							/>
							<InputFree
								label="قیمت ریالی"
								containerClassName="col-span-1"
								value={product.irrPrice}
								icon={DollarSign}
							/>
							<InputFree
								label="قیمت جدید"
								type="number"
								value={newProducts[index]?.irrPrice}
								onValueChange={(value) => {
									setNewProducts((prev) => {
										const updatedProducts = prev?.map(
											(product, i) => {
												if (i === index) {
													return {
														...product,
														irrPrice: Number(value),
													};
												}
												return product;
											},
										);

										return updatedProducts;
									});
								}}
								containerClassName="col-span-1"
								icon={DollarSign}
							/>
						</div>
					))
				) : (
					<div className="flex justify-center items-center text-2xl w-full min-h-[50vh]">
						هیچ محصولی یافت نشد.
					</div>
				)}
				<StickyDialogFooter>
					<div className="flex gap-4">
						<CurrencyConvertRatesDialog />
						<Button variant="primary">ثبت تغییرات</Button>
					</div>
				</StickyDialogFooter>
			</DialogContent>
		</Dialog>
	);
}

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
import ProductInfoDialog from "../Product/ProductInfoDialog";
import StickyDialogFooter from "@/components/StickyDialogFooter/StickyDialogFooter";
import InputFree from "@/components/Custom/Input/InputFree";
import { DollarSign } from "lucide-react";
import CurrencyConvertRatesDialog from "../Currency/CurrencyConvertRatesDialog";
import { getCurrencies } from "@/services/currency";

export default function CategoryPriceUpdateDialog({
	category,
	products,
}: {
	category: Category;
	products: Product[];
}) {
	const [open, setOpen] = useState<boolean>(false);
	// const [currencies, setCurrencies] = useState<Currency[]>([]);
	const [newProducts, setNewProducts] = useState<Product[]>(products);

	useEffect(() => {
		getCurrencies().then((data) => {
			const currencies = data?.data;
			// setCurrencies(currencies);
			setNewProducts((prev) => [
				...prev.map((product) => ({
					...product,
					irrPrice:
						Number(product.price) *
						currencies.find(
							(currency: Currency) =>
								currency.id === product.currencyID,
						).convertRate,
				})),
			]);
			// (products) => [...products.map((product) => {...products, irrPrice:
			// 		Number(product.price) *
			// 		currencies.find(
			// 			(currency: Currency) =>
			// 				currency.id === product.currencyID,
			// 		).convertRate}])
		});
	}, []);

	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				setOpen(val);
			}}
		>
			<DialogTrigger>
				<Button variant="primary">تغییر قیمت</Button>
			</DialogTrigger>
			<DialogContent variant="action" className="max-w-6xl">
				<DialogHeader>
					<DialogTitle>
						تغییر قیمت محصولات دسته‌بندی {category?.name}
					</DialogTitle>
				</DialogHeader>
				{products.map((product, index) => (
					<div className="grid grid-cols-5 gap-2" key={index}>
						<ProductInfoDialog
							product={product}
							variant="name"
							className="col-span-2"
						/>
						<InputFree
							label={`قیمت اصلی (${product.currency?.name})`}
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
							value={newProducts[index].irrPrice}
							// onValueChange={(value) => {
							// 	setNewProducts((prev) =>
							// 		prev.map((product, index) => {}),
							// 	);
							// }}
							onValueChange={(value) => {
								setNewProducts((prev) => {
									const updatedProducts = prev.map(
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
				))}
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

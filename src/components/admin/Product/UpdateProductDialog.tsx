"use client";
import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Formik, Form } from "formik";
import {
	createProductInitialValues,
	createProductSchema,
} from "@/schemas/ProductSchemas";
import {
	Globe,
	List,
	Pencil,
	Package,
	Plus,
	DollarSign,
	Hash,
	ShoppingCart,
	Star,
	TrendingUp,
	FolderTree,
	Tag,
	Copy,
	Percent,
	PercentCircle,
} from "lucide-react";
import Input from "@/components/Custom/Input/Input";
import Textarea from "@/components/Custom/Textarea/Textarea";
import Checkbox from "@/components/Custom/Checkbox/Checkbox";
import ImageCropModal from "../ImageCropModal";
import StickyDialogFooter from "@/components/StickyDialogFooter/StickyDialogFooter";
import { postImageData, putImageData } from "@/services/services";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import Button from "@/components/Custom/Button/Button";
import { translateErrorObject } from "@/utils/translateErrorObject";
import Select from "@/components/Custom/Select/Select";
import InputFree from "@/components/Custom/Input/InputFree";
import CheckboxFree from "@/components/Custom/Checkbox/CheckboxFree";

interface UpdateProductDialogProps {
	product?: Product;
	fetchProducts: () => void;
	mode: "update" | "create" | "copy";
	categories?: Array<{ id: number; name: string }>;
	brands?: Array<{ id: number; name: string }>;
}

export default function UpdateProductDialog({
	product,
	fetchProducts,
	mode = "create",
	categories = [],
	brands = [],
}: UpdateProductDialogProps) {
	const [productDialogOpen, setProductDialogOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	// const [basePrice, setBasePrice] = useState<number | undefined>(undefined);
	// const [step2Origin, setStep2Origin] = useState<boolean>(false);
	// const [step3Origin, setStep3Origin] = useState<boolean>(false);
	// const [baseStep1, setBaseStep1] = useState<number | undefined>(undefined);
	// const [baseStep2, setBaseStep2] = useState<number | undefined>(undefined);
	// const [baseStep3, setBaseStep3] = useState<number | undefined>(undefined);
	// const [step1, setStep1] = useState<number | undefined>(undefined);
	// const [step2, setStep2] = useState<number | undefined>(undefined);
	// const [step3, setStep3] = useState<number | undefined>(undefined);

	const [price, setPrice] = useState<number | undefined>();
	const [consumerPrice, setConsumerPrice] = useState<number | undefined>();
	const [basePrice, setBasePrice] = useState<number | undefined>();

	const [step1, setStep1] = useState<number | undefined>();
	const [baseStep1, setBaseStep1] = useState<number | undefined>();

	const [step2, setStep2] = useState<number | undefined>();
	const [baseStep2, setBaseStep2] = useState<number | undefined>();

	const [step3, setStep3] = useState<number | undefined>();
	const [baseStep3, setBaseStep3] = useState<number | undefined>();

	const [step2Origin, setStep2Origin] = useState(false);
	const [step3Origin, setStep3Origin] = useState(false);

	const basePriceSafe = basePrice || 0;
	const baseStep1Safe = baseStep1 || 0;
	const baseStep2Safe = baseStep2 || 0;
	const baseStep3Safe = baseStep3 || 0;

	const updateProduct = async (
		values: Product,
		{ setErrors }: { setErrors: any },
	) => {
		setLoading(true);
		const formData = new FormData();

		// Only append changed fields for update mode
		if (!(mode === "update" && product?.name === values.name)) {
			formData.append("name", values.name);
		}
		if (!(mode === "update" && product?.slug === values.slug)) {
			formData.append("slug", values.slug);
		}
		if (!(mode === "update" && product?.price === values.price)) {
			formData.append("price", values.price.toString());
		}
		if (
			!(mode === "update" && product?.description === values.description)
		) {
			formData.append("description", values.description || "");
		}
		formData.append("isActive", values.isActive.toString());
		formData.append("isNew", values.isNew.toString());

		if (!(mode === "update" && product?.priority === values.priority)) {
			formData.append("priority", (values.priority || 0).toString());
		}
		if (!(mode === "update" && product?.minOrder === values.minOrder)) {
			formData.append("minOrder", (values.minOrder || 1).toString());
		}
		if (!(mode === "update" && product?.categoryID === values.categoryID)) {
			if (values.categoryID && values.categoryID !== "0") {
				formData.append("categoryID", values.categoryID.toString());
			}
		}
		if (!(mode === "update" && product?.brandID === values.brandID)) {
			if (values.brandID && values.brandID !== "0") {
				formData.append("brandID", values.brandID.toString());
			}
		}
		if (!(mode === "update" && product?.quantity === values.quantity)) {
			formData.append("quantity", values.quantity.toString());
		}
		if (
			!(
				mode === "update" &&
				product?.quantityType === values.quantityType
			)
		) {
			formData.append("quantityType", values.quantityType);
		}
		if (
			!(
				mode === "update" &&
				product?.currencyCode === values.currencyCode
			)
		) {
			formData.append("currencyCode", values.currencyCode);
		}

		// Handle image upload
		if (
			values.productPic &&
			!(mode === "update" && product?.productPic === values.productPic)
		) {
			if (mode === "copy") {
				formData.append("productPic", values.productPic);
			} else {
				const base64Response = await fetch(values.productPic);
				const blob = await base64Response.blob();
				const file = new File([blob], `product-${Date.now()}.jpg`, {
					type: "image/jpeg",
				});
				formData.append("productPic", file);
			}
		}

		console.log("FormData entries:");
		for (let [key, value] of formData.entries()) {
			console.log(
				key,
				value instanceof File ? `File: ${value.name}` : value,
			);
		}

		const apiFunc = mode === "update" ? putImageData : postImageData;
		apiFunc({
			endPoint: `/v1/product${mode === "update" ? "/" + product?.id : ""}`,
			data: formData,
		})
			.then((data) => {
				CustomToast(data.message, "success");
				setProductDialogOpen(false);
				fetchProducts();
			})
			.catch((error) => {
				console.log(
					"error",
					translateErrorObject(error?.response?.data?.messages),
				);
				setErrors(
					translateErrorObject(error?.response?.data?.messages),
				);
			})
			.finally(() => setLoading(false));
	};

	// const handleStep1Percent = (value: string) => {
	// 	if (!value || basePrice === undefined) {
	// 		setStep1(undefined);
	// 		setBaseStep1(undefined);
	// 		return;
	// 	}

	// 	const percent = Number(value);
	// 	const newPrice = Math.round(basePrice * (1 + percent / 100));

	// 	setStep1(percent);
	// 	setBaseStep1(newPrice);
	// };

	// const handleStep1Price = (value: string) => {
	// 	if (!value || basePrice === undefined) {
	// 		setBaseStep1(undefined);
	// 		return;
	// 	}

	// 	const price = Number(value);
	// 	setBaseStep1(price);

	// 	// const percent = calculatePercent(basePrice, price);
	// 	// setStep1(percent);
	// };

	// const handleStep2Percent = (value: string) => {
	// 	if (!value || basePrice === undefined) {
	// 		setStep2(undefined);
	// 		setBaseStep2(undefined);
	// 		return;
	// 	}

	// 	const base = step2Origin ? basePrice : (baseStep1 ?? 0);

	// 	const percent = Number(value);
	// 	const newPrice = Math.round(base * (1 + percent / 100));

	// 	setStep2(percent);
	// 	setBaseStep2(newPrice);
	// };

	// const handleStep2Price = (value: string) => {
	// 	if (!value || basePrice === undefined) {
	// 		setBaseStep2(undefined);
	// 		return;
	// 	}

	// 	const base = step2Origin ? basePrice : (baseStep1 ?? 0);

	// 	const price = Number(value);
	// 	setBaseStep2(price);

	// 	// const percent = calculatePercent(base, price);
	// 	// setStep2(percent);
	// };

	// const handleStep3Percent = (value: string) => {
	// 	if (!value || basePrice === undefined) {
	// 		setStep3(undefined);
	// 		setBaseStep3(undefined);
	// 		return;
	// 	}
	// 	const base = step3Origin ? basePrice : (baseStep2 ?? 0);

	// 	const percent = Number(value);
	// 	const newPrice = Math.round(base * (1 + percent / 100));

	// 	setStep3(percent);
	// 	setBaseStep3(newPrice);
	// };

	// const handleStep3Price = (value: string) => {
	// 	if (!value || basePrice === undefined) {
	// 		setBaseStep3(undefined);
	// 		return;
	// 	}

	// 	const base = step3Origin ? basePrice : (baseStep2 ?? 0);

	// 	const price = Number(value);
	// 	setBaseStep3(price);

	// 	// const percent = calculatePercent(base, price);
	// 	// setStep3(percent);
	// };

	// useEffect(() => {
	// 	if (basePrice === undefined) return;

	// 	// Step 1
	// 	if (step1 !== undefined) {
	// 		const calculated = Math.round(basePrice * (1 + step1 / 100));
	// 		setBaseStep1(calculated);
	// 	}

	// 	// Step 2
	// 	if (step2 !== undefined) {
	// 		const baseForStep2 = step2Origin ? basePrice : (baseStep1 ?? 0);

	// 		setBaseStep2(Math.round(baseForStep2 * (1 + step2 / 100)));
	// 	}

	// 	// Step 3
	// 	if (step3 !== undefined) {
	// 		const baseForStep3 = step3Origin ? basePrice : (baseStep2 ?? 0);

	// 		setBaseStep3(Math.round(baseForStep3 * (1 + step3 / 100)));
	// 	}
	// }, [basePrice, step1, step2, step3, step2Origin, step3Origin]);

	// useEffect(() => {
	// 	const base1 = basePriceSafe;
	// 	const calculatedBaseStep1 =
	// 		step1 !== undefined
	// 			? Math.round(base1 * (1 + step1 / 100))
	// 			: undefined;

	// 	setBaseStep1(calculatedBaseStep1);

	// 	const base2 = step2Origin ? basePriceSafe : (calculatedBaseStep1 ?? 0);
	// 	const calculatedBaseStep2 =
	// 		step2 !== undefined
	// 			? Math.round(base2 * (1 + step2 / 100))
	// 			: undefined;

	// 	setBaseStep2(calculatedBaseStep2);

	// 	const base3 = step3Origin ? basePriceSafe : (calculatedBaseStep2 ?? 0);
	// 	const calculatedBaseStep3 =
	// 		step3 !== undefined
	// 			? Math.round(base3 * (1 + step3 / 100))
	// 			: undefined;

	// 	setBaseStep3(calculatedBaseStep3);
	// }, [basePrice, step1, step2, step3, step2Origin, step3Origin]);

	// useEffect(() => {
	// 	if (!basePrice) return;
	// 	if (step1 !== undefined) handleStep1Percent(step1.toString());
	// 	if (step2 !== undefined) handleStep2Percent(step2.toString());
	// 	if (step3 !== undefined) handleStep3Percent(step3.toString());
	// }, [basePrice]);

	// useEffect(() => {
	// 	if (basePrice === undefined) return;
	// 	if (step1 === undefined) return;
	// 	const percent1 = Number(step1);
	// 	const newPrice1 = Math.round(basePrice * (1 + percent1 / 100));
	// 	handleStep1Price(newPrice1?.toString());
	// 	if (step2 === undefined) return;
	// 	const basePrice2 = step2Origin ? basePrice : newPrice1;
	// 	const percent2 = Number(step2);
	// 	const newPrice2 = Math.round(basePrice2 * (1 + percent2 / 100));
	// 	handleStep2Price(newPrice2?.toString());
	// 	if (step3 === undefined) return;
	// 	const basePrice3 = step3Origin ? basePrice : newPrice2;
	// 	const percent3 = Number(step3);
	// 	const newPrice3 = Math.round(basePrice3 * (1 + percent3 / 100));
	// 	handleStep2Price(newPrice3?.toString());
	// }, [basePrice]);

	// Base rice
	useEffect(() => {
		if (price === undefined) return;
		setBasePrice(price * 45000);
	}, [price]);

	// Step 1 Price
	useEffect(() => {
		if (basePrice === undefined || step1 === undefined) return;
		setBaseStep1(basePrice * (1 + Number(step1) / 100));
	}, [basePrice, step1]);

	// Step 2 Price
	useEffect(() => {
		if (step2Origin) {
			if (basePrice === undefined || step2 === undefined) return;
			setBaseStep2(basePrice * (1 + Number(step2) / 100));
		} else {
			if (baseStep1 === undefined || step2 === undefined) return;
			setBaseStep2(baseStep1 * (1 + Number(step2) / 100));
		}
	}, [step2Origin, basePrice, baseStep1, step2]);

	// Step 3 Price
	useEffect(() => {
		if (step3Origin) {
			if (basePrice === undefined || step3 === undefined) return;
			setBaseStep3(basePrice * (1 + Number(step3) / 100));
		} else {
			if (baseStep2 === undefined || step2 === undefined) return;
			setBaseStep3(baseStep2 * (1 + Number(step3) / 100));
		}
	}, [step3Origin, basePrice, baseStep2, step3]);

	return (
		<Dialog
			open={productDialogOpen}
			onOpenChange={(value: boolean) => setProductDialogOpen(value)}
		>
			<DialogTrigger>
				{mode === "create" ? (
					<Button className="gap-2">
						<Plus className="w-4 h-4" />
						<p>افزودن محصول</p>
					</Button>
				) : mode === "update" ? (
					<Button
						size="icon"
						variant="secondary"
						className="h-8 w-8 hover:bg-background/80"
					>
						<Pencil className="w-4 h-4" />
					</Button>
				) : (
					<Button
						size="icon"
						variant="secondary"
						className="h-8 w-8 hover:bg-background/80"
					>
						<Copy className="w-4 h-4" />
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<Formik
					initialValues={
						mode === "create"
							? createProductInitialValues
							: product!
					}
					validationSchema={createProductSchema}
					onSubmit={updateProduct}
				>
					{({ values, setFieldValue }) => (
						<Form className="grid gap-4">
							<DialogHeader>
								<DialogTitle>
									{mode !== "update"
										? "افزودن محصول جدید"
										: "ویرایش محصول"}
								</DialogTitle>
							</DialogHeader>

							{/* Name and Slug */}
							<div className="grid grid-cols-2 gap-4">
								<Input
									name="name"
									icon={Package}
									label="نام فارسی محصول"
								/>
								<Input
									name="slug"
									icon={Globe}
									label="نام انگلیسی محصول"
								/>
							</div>
							<div className="grid grid-cols-4 gap-4">
								{/* <Checkbox
									name="foreign"
									label="محصول خارجی است"
								/> */}
								<Input
									value={price}
									onValueChange={(value: string) => {
										setPrice(Number(value));
									}}
									type="number"
									label="قیمت"
									icon={DollarSign}
								/>
								<Select
									name="currencyCode"
									label="واحد پول"
									icon={DollarSign}
									options={[
										{ value: "IRR", label: "ریال (IRR)" },
										{ value: "USD", label: "دلار (USD)" },
										{ value: "EUR", label: "یورو (EUR)" },
										{ value: "GBP", label: "پوند (GBP)" },
										{ value: "AED", label: "درهم (AED)" },
										{ value: "TRY", label: "لیر (TRY)" },
									]}
								/>
								<Input
									value={Math.round(basePriceSafe) || ""}
									onValueChange={(value: string) => {
										setBasePrice(Number(value));
									}}
									type="number"
									icon={DollarSign}
									label="معادل ریالی"
								/>
								<Input
									value={consumerPrice}
									onValueChange={(value: string) => {
										setConsumerPrice(Number(value));
									}}
									type="number"
									label="قیمت مصرف کننده"
									icon={DollarSign}
								/>
							</div>

							{/* Step 1 */}
							<div className="grid grid-cols-3 gap-4">
								<Input
									value={step1}
									onValueChange={(value: string) => {
										setStep1(Number(value));
										// handleStep1Percent(value);
									}}
									type="number"
									icon={Percent}
									label="درصد پله 1"
								/>
								<Input
									type="number"
									value={Math.round(baseStep1Safe) || ""}
									onValueChange={(value: string) => {
										setBaseStep1(Number(value));
										// handleStep1Price(value);
										// setBaseStep1(Number(value));
									}}
									icon={PercentCircle}
									label="قیمت پله 1"
								/>
							</div>

							{/* Step 2 */}
							<div className="grid grid-cols-3 gap-4">
								<Input
									value={step2}
									onValueChange={(value: string) => {
										setStep2(Number(value));
										// handleStep2Percent(value);
										// updateStep2Base(value, step2Origin);
									}}
									type="number"
									icon={Percent}
									label="درصد پله 2"
								/>
								<Input
									value={Math.round(baseStep2Safe) || ""}
									onValueChange={(value: string) => {
										setBaseStep2(Number(value));
										// handleStep2Price(value);
										// setBaseStep2(Number(value));
									}}
									type="number"
									icon={PercentCircle}
									label="قیمت پله 2"
								/>
								<Checkbox
									checked={step2Origin}
									onValueChange={(value: boolean) => {
										setStep2Origin(value);
										// updateStep2Base(
										// 	step2Safe.toString(),
										// 	value,
										// );
									}}
									label="نسبت به قیمت اصلی"
								/>
							</div>

							{/* Step 3 */}
							<div className="grid grid-cols-3 gap-4">
								<Input
									value={step3}
									onValueChange={(value: string) => {
										setStep3(Number(value));
										// handleStep3Percent(value);
										// updateStep3Base(value, step3Origin);
									}}
									type="number"
									icon={Percent}
									label="درصد پله 3"
								/>
								<Input
									type="number"
									icon={PercentCircle}
									value={Math.round(baseStep3Safe) || ""}
									onValueChange={(value: string) => {
										setBaseStep3(Number(value));
										// handleStep3Price(value);
										// setBaseStep3(Number(value));
									}}
									label="قیمت پله 3"
								/>
								<Checkbox
									checked={step3Origin}
									onValueChange={(value: boolean) => {
										setStep3Origin(value);
										// updateStep3Base(
										// 	step3Safe.toString(),
										// 	value,
										// );
									}}
									label="نسبت به قیمت اصلی"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<Input
									name="priority"
									type="number"
									icon={TrendingUp}
									label="اولویت نمایش"
								/>
								<Input
									name="quantity"
									icon={Hash}
									label="موجودی"
								/>
							</div>

							{/* Quantity and Type */}
							<div className="grid grid-cols-2 gap-4">
								<Input
									name="minOrder"
									type="number"
									icon={ShoppingCart}
									label="حداقل سفارش"
								/>
								<Input
									name="quantityType"
									icon={ShoppingCart}
									label="واحد شمارش"
								/>
							</div>

							{/* Category and Brand */}
							<div className="grid grid-cols-2 gap-4">
								<Select
									name="categoryID"
									label="دسته‌بندی"
									icon={FolderTree}
									helper="انتخاب دسته‌بندی"
									options={[
										{
											value: "",
											label: "انتخاب دسته‌بندی",
										},
										...categories.map((cat) => ({
											value: cat.id.toString(),
											label: cat.name,
										})),
									]}
								/>
								<Select
									name="brandID"
									label="برند"
									icon={Tag}
									helper="انتخاب برند"
									options={[
										{ value: "", label: "انتخاب برند" },
										...brands.map((brand) => ({
											value: brand.id.toString(),
											label: brand.name,
										})),
									]}
								/>
							</div>

							{/* Description */}
							<Textarea
								name="description"
								icon={List}
								label="توضیحات محصول"
							/>

							{/* Checkboxes */}
							<div className="flex gap-6">
								<Checkbox
									name="isActive"
									label="محصول فعال است"
								/>
								<Checkbox name="isNew" label="محصول جدید است" />
							</div>

							{/* Image Upload */}
							<ImageCropModal
								name="productPic"
								label="تصویر محصول"
							/>

							{/* Footer Buttons */}
							<StickyDialogFooter>
								<div className="flex gap-4">
									<Button
										onClick={() =>
											setProductDialogOpen(false)
										}
										type="button"
										variant="outline"
									>
										انصراف
									</Button>
									<Button
										className="bg-primary-rose hover:bg-primary-rose/80 text-black"
										type="submit"
										loading={loading}
									>
										{mode !== "update"
											? "افزودن محصول"
											: "ذخیره تغییرات"}
									</Button>
								</div>
							</StickyDialogFooter>
						</Form>
					)}
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

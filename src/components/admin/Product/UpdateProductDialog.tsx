"use client";
import React, { use, useEffect, useState } from "react";
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
import { getData, postImageData, putImageData } from "@/services/services";
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
	// const [irrPrice, setIrrPrice] = useState<number | undefined>(undefined);
	const [step2Origin, setStep2Origin] = useState<boolean>(false);
	const [step3Origin, setStep3Origin] = useState<boolean>(false);
	const [currencies, setCurrencies] = useState<Currency[]>([]);

	// const [baseStep1, setBaseStep1] = useState<number | undefined>(undefined);
	// const [baseStep2, setBaseStep2] = useState<number | undefined>(undefined);
	// const [baseStep3, setBaseStep3] = useState<number | undefined>(undefined);
	// const [step1, setStep1] = useState<number | undefined>(undefined);
	// const [step2, setStep2] = useState<number | undefined>(undefined);
	// const [step3, setStep3] = useState<number | undefined>(undefined);

	// const [price, setPrice] = useState<number | undefined>();
	// const [consumerPrice, setConsumerPrice] = useState<number | undefined>();
	// const [irrPrice, setIrrPrice] = useState<number | undefined>();

	// const [step1, setStep1] = useState<number | undefined>();
	// const [baseStep1, setBaseStep1] = useState<number | undefined>();

	// const [step2, setStep2] = useState<number | undefined>();
	// const [baseStep2, setBaseStep2] = useState<number | undefined>();

	// const [step3, setStep3] = useState<number | undefined>();
	// const [baseStep3, setBaseStep3] = useState<number | undefined>();

	// const [step2Origin, setStep2Origin] = useState(false);
	// const [step3Origin, setStep3Origin] = useState(false);

	// const irrPriceSafe = irrPrice || 0;
	// const baseStep1Safe = baseStep1 || 0;
	// const baseStep2Safe = baseStep2 || 0;
	// const baseStep3Safe = baseStep3 || 0;

	const fetchCurrencies = () => {
		getData({ endPoint: `/v1/currency` }).then((data) => {
			setCurrencies(data?.data);
		});
	};

	useEffect(() => {
		fetchCurrencies();
	}, []);

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
		if (
			!(mode === "update" && product?.price === values.price) &&
			values.price
		) {
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
		if (!(mode === "update" && product?.currencyID === values.currencyID)) {
			formData.append("currencyID", values.currencyID.toString());
		}
		if (
			!(mode === "update" && product?.irrPrice === values.irrPrice) &&
			values.irrPrice
		) {
			formData.append("irrPrice", values.irrPrice?.toString());
		}
		if (
			!(
				mode === "update" &&
				product?.consumerPrice === values.consumerPrice
			) &&
			values.consumerPrice
		) {
			formData.append("consumerPrice", values.consumerPrice?.toString());
		}
		if (
			!(
				mode === "update" &&
				product?.step1Percent === values.step1Percent
			) &&
			values.step1Percent
		) {
			formData.append("step1Percent", values.step1Percent?.toString());
		}
		if (
			!(
				mode === "update" &&
				product?.step2Percent === values.step2Percent
			) &&
			values.step2Percent
		) {
			formData.append("istep2Percente", values.step2Percent?.toString());
		}
		if (
			!(
				mode === "update" &&
				product?.step3Percent === values.step3Percent
			) &&
			values.step3Percent
		) {
			formData.append("step3Percent", values.step3Percent?.toString());
		}
		if (
			!(mode === "update" && product?.step1Price === values.step1Price) &&
			values.step1Price
		) {
			formData.append("step1Price", values.step1Price?.toString());
		}
		if (
			!(mode === "update" && product?.step2Price === values.step2Price) &&
			values.step2Price
		) {
			formData.append("step2Price", values.step2Price?.toString());
		}
		if (
			!(mode === "update" && product?.step3Price === values.step3Price) &&
			values.step3Price
		) {
			formData.append("step3Price", values.step3Price?.toString());
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

	// // Base rice
	// useEffect(() => {
	// 	if (price === undefined) return;
	// 	setIrrPrice(price * 45000);
	// }, [price]);

	// // Step 1 Price
	// useEffect(() => {
	// 	if (irrPrice === undefined || step1 === undefined) return;
	// 	setBaseStep1(irrPrice * (1 + Number(step1) / 100));
	// }, [irrPrice, step1]);

	// // Step 2 Price
	// useEffect(() => {
	// 	if (step2Origin) {
	// 		if (irrPrice === undefined || step2 === undefined) return;
	// 		setBaseStep2(irrPrice * (1 + Number(step2) / 100));
	// 	} else {
	// 		if (baseStep1 === undefined || step2 === undefined) return;
	// 		setBaseStep2(baseStep1 * (1 + Number(step2) / 100));
	// 	}
	// }, [step2Origin, irrPrice, baseStep1, step2]);

	// // Step 3 Price
	// useEffect(() => {
	// 	if (step3Origin) {
	// 		if (irrPrice === undefined || step3 === undefined) return;
	// 		setBaseStep3(irrPrice * (1 + Number(step3) / 100));
	// 	} else {
	// 		if (baseStep2 === undefined || step2 === undefined) return;
	// 		setBaseStep3(baseStep2 * (1 + Number(step3) / 100));
	// 	}
	// }, [step3Origin, irrPrice, baseStep2, step3]);

	return (
		<Dialog
			open={productDialogOpen}
			onOpenChange={(value: boolean) => setProductDialogOpen(value)}
		>
			<DialogTrigger
			// size={mode !== "create" ? "icon" : "default"}
			// variant={mode !== "create" ? "secondary" : "default"}
			// className={
			// 	mode !== "create"
			// 		? "h-8 w-8 hover:bg-background/80"
			// 		: "gap-2"
			// }
			>
				{/* <div>
					<Plus className="w-4 h-4" />
					<p>افزودن محصول</p>
				</div> */}
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
					{({ values, setFieldValue }) => {
						const price = values["price"];
						const irrPrice = values["irrPrice"];
						const step1 = values["step1Percent"];
						const step2 = values["step2Percent"];
						const step3 = values["step3Percent"];
						const baseStep1 = values["step1Price"];
						const baseStep2 = values["step2Price"];
						const baseStep3 = values["step3Price"];
						const rate =
							currencies.find(
								(currency: Currency) =>
									currency.id ===
									Number(values["currencyID"]),
							)?.convertRate || 1;
						// Base rice
						useEffect(() => {
							if (price === undefined) return;
							setFieldValue("irrPrice", Math.round(price * rate));
						}, [price, rate]);

						// Step 1 Price
						useEffect(() => {
							if (irrPrice === undefined || step1 === undefined)
								return;
							setFieldValue(
								"step1Price",
								Math.round(
									irrPrice * (1 + Number(step1) / 100),
								),
							);
						}, [irrPrice, step1]);

						// Step 2 Price
						useEffect(() => {
							if (step2Origin) {
								if (
									irrPrice === undefined ||
									step2 === undefined
								)
									return;
								setFieldValue(
									"step2Price",
									Math.round(
										irrPrice * (1 + Number(step2) / 100),
									),
								);
							} else {
								if (
									baseStep1 === undefined ||
									step2 === undefined
								)
									return;
								setFieldValue(
									"step2Price",
									Math.round(
										baseStep1 * (1 + Number(step2) / 100),
									),
								);
							}
						}, [step2Origin, irrPrice, baseStep1, step2]);

						// Step 3 Price
						useEffect(() => {
							if (step3Origin) {
								if (
									irrPrice === undefined ||
									step3 === undefined
								)
									return;
								setFieldValue(
									"step3Price",
									Math.round(
										irrPrice * (1 + Number(step3) / 100),
									),
								);
							} else {
								if (
									baseStep2 === undefined ||
									step2 === undefined
								)
									return;
								setFieldValue(
									"step3Price",
									Math.round(
										baseStep2 * (1 + Number(step3) / 100),
									),
								);
							}
						}, [step3Origin, irrPrice, baseStep2, step3]);
						return (
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
										name="price"
										// value={price}
										// onValueChange={(value: string) => {
										// 	setPrice(Number(value));
										// }}
										type="number"
										label="قیمت"
										icon={DollarSign}
									/>
									<Select
										name="currencyID"
										label="واحد پول"
										icon={DollarSign}
										options={currencies.map(
											(currency: Currency) => ({
												value: currency.id.toString(),
												label: `${currency.name} (${currency.code})`,
											}),
										)}
									/>
									<Input
										name="irrPrice"
										// value={Math.round(irrPriceSafe) || ""}
										// onValueChange={(value: string) => {
										// 	setIrrPrice(Number(value));
										// }}
										type="number"
										icon={DollarSign}
										label="معادل ریالی"
									/>
									<Input
										name="consumerPrice"
										// value={consumerPrice}
										// onValueChange={(value: string) => {
										// 	setConsumerPrice(Number(value));
										// }}
										type="number"
										label="قیمت مصرف کننده"
										icon={DollarSign}
									/>
								</div>

								{/* Step 1 */}
								<div className="grid grid-cols-3 gap-4">
									<Input
										name="step1Percent"
										// value={step1}
										// onValueChange={(value: string) => {
										// 	setStep1(Number(value));
										// 	// handleStep1Percent(value);
										// }}
										type="number"
										icon={Percent}
										label="درصد پله 1"
									/>
									<Input
										name="step1Price"
										// value={Math.round(baseStep1Safe) || ""}
										// onValueChange={(value: string) => {
										// 	setBaseStep1(Number(value));
										// 	// handleStep1Price(value);
										// 	// setBaseStep1(Number(value));
										// }}
										type="number"
										icon={PercentCircle}
										label="قیمت پله 1"
									/>
								</div>

								{/* Step 2 */}
								<div className="grid grid-cols-3 gap-4">
									<Input
										name="step2Percent"
										// value={step2}
										// onValueChange={(value: string) => {
										// 	setStep2(Number(value));
										// 	// handleStep2Percent(value);
										// 	// updateStep2Base(value, step2Origin);
										// }}
										type="number"
										icon={Percent}
										label="درصد پله 2"
									/>
									<Input
										name="step2Price"
										// value={Math.round(baseStep2Safe) || ""}
										// onValueChange={(value: string) => {
										// 	setBaseStep2(Number(value));
										// 	// handleStep2Price(value);
										// 	// setBaseStep2(Number(value));
										// }}
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
										name="step3Percent"
										// value={step3}
										// onValueChange={(value: string) => {
										// 	setStep3(Number(value));
										// 	// handleStep3Percent(value);
										// 	// updateStep3Base(value, step3Origin);
										// }}
										type="number"
										icon={Percent}
										label="درصد پله 3"
									/>
									<Input
										name="step3Price"
										// value={Math.round(baseStep3Safe) || ""}
										// onValueChange={(value: string) => {
										// 	setBaseStep3(Number(value));
										// 	// handleStep3Price(value);
										// 	// setBaseStep3(Number(value));
										// }}
										type="number"
										icon={PercentCircle}
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
										name="quantity"
										icon={Hash}
										label="موجودی"
									/>
									<Input
										name="quantityType"
										icon={ShoppingCart}
										label="واحد شمارش"
									/>
								</div>

								{/* Quantity and Type */}
								<div className="grid grid-cols-2 gap-4">
									<Input
										name="priority"
										type="number"
										icon={TrendingUp}
										label="اولویت نمایش"
									/>
									<Input
										name="minOrder"
										type="number"
										icon={ShoppingCart}
										label="حداقل سفارش"
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
											...(categories?.map((cat) => ({
												value: cat.id.toString(),
												label: cat.name,
											})) ?? []),
										]}
									/>
									<Select
										name="brandID"
										label="برند"
										icon={Tag}
										helper="انتخاب برند"
										options={[
											{ value: "", label: "انتخاب برند" },
											...(brands?.map((brand) => ({
												value: brand.id.toString(),
												label: brand.name,
											})) ?? []),
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
									<Checkbox
										name="isNew"
										label="محصول جدید است"
									/>
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
						);
					}}
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

"use client";
import React, { useState } from "react";
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

interface UpdateProductDialogProps {
	product?: Product;
	fetchProducts: () => void;
	mode: "update" | "create";
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
			if (values.categoryID) {
				formData.append("categoryID", values.categoryID.toString());
			}
		}
		if (!(mode === "update" && product?.brandID === values.brandID)) {
			if (values.brandID) {
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
			const base64Response = await fetch(values.productPic);
			const blob = await base64Response.blob();
			const file = new File([blob], `product-${Date.now()}.jpg`, {
				type: "image/jpeg",
			});
			formData.append("productPic", file);
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
				) : (
					<Button
						size="icon"
						variant="secondary"
						className="h-8 w-8 hover:bg-background/80"
					>
						<Pencil className="w-4 h-4" />
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
									{mode === "create"
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

							{/* Price and Currency */}
							<div className="grid grid-cols-3 gap-4">
								<Input
									name="price"
									type="number"
									icon={DollarSign}
									label="قیمت"
									onlyNumbers
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
									name="priority"
									type="number"
									icon={TrendingUp}
									label="اولویت نمایش"
									onlyNumbers
								/>
							</div>

							{/* Quantity and Type */}
							<div className="grid grid-cols-3 gap-4">
								<Input
									name="quantity"
									type="number"
									icon={Hash}
									label="موجودی"
									onlyNumbers
								/>
								<Input
									name="minOrder"
									type="number"
									icon={ShoppingCart}
									label="حداقل سفارش"
									onlyNumbers
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
										{mode === "create"
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

"use client";
import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Formik, Form } from "formik";
import {
	createBrandInitialValues,
	createBrandSchema,
} from "@/schemas/BrandSchemas";
import {
	Globe,
	List,
	MapPin,
	Pencil,
	Package,
	PersonStanding,
	Plus,
} from "lucide-react";
import Input from "@/components/Custom/Input/Input";
import Textarea from "@/components/Custom/Textarea/Textarea";
import Checkbox from "@/components/Custom/Checkbox/Checkbox";
import ImageCropModal from "../ImageCropModal";
import StickyDialogFooter from "@/components/StickyDialogFooter/StickyDialogFooter";
import { postData, postImageData, putImageData } from "@/services/services";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import Button from "@/components/Custom/Button/Button";
import { translateErrorObject } from "@/utils/translateErrorObject";

export default function UpdateBrandDialog({
	brand,
	fetchBrands,
	mode = "create",
}: {
	brand?: Brand;
	fetchBrands: () => void;
	mode: "update" | "create";
}) {
	const [brandDialogOpen, setBrandDialogOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const updateBrand = async (
		values: Brand,
		{ setErrors }: { setErrors: any },
	) => {
		setLoading(true);
		const formData = new FormData();
		if (!(mode === "update" && brand?.name === values.name)) {
			formData.append("name", values.name);
		}
		if (!(mode === "update" && brand?.slug === values.slug)) {
			formData.append("slug", values.slug);
		}
		if (!(mode === "update" && brand?.description === values.description)) {
			formData.append("description", values.description || "");
		}
		// if (!(mode === "update" && brand?.isActive === values.isActive)) {
		// }
		formData.append("isActive", values.isActive.toString());
		if (
			values.brandPic &&
			!(mode === "update" && brand?.brandPic === values.brandPic)
		) {
			// Convert base64 string to Blob/File
			const base64Response = await fetch(values.brandPic);
			const blob = await base64Response.blob();

			// Create a File object from the Blob
			const file = new File([blob], `brand-${Date.now()}.jpg`, {
				type: "image/jpeg",
			});

			formData.append("brandPic", file);
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
			endPoint: `/v1/brand${mode === "update" ? "/" + brand?.id : ""}`,
			data: formData,
		})
			.then((data) => {
				CustomToast(data.message, "success");
				setBrandDialogOpen(false);
				fetchBrands();
			})
			.catch((error) => {
				console.log(
					"error",
					translateErrorObject(error.response.data.messages),
				);
				setErrors(translateErrorObject(error.response.data.messages));
			})
			.finally(() => setLoading(false));
	};
	return (
		<Dialog
			open={brandDialogOpen}
			onOpenChange={(value: boolean) => setBrandDialogOpen(value)}
		>
			<DialogTrigger>
				{mode === "create" ? (
					<Button className="gap-2">
						<Plus className="w-4 h-4" />
						<p>
							{mode === "create" ? "افزودن برند" : "ویرایش برند"}
						</p>
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
			<DialogContent variant="action">
				<Formik
					initialValues={
						mode === "create"
							? createBrandInitialValues
							: brand || createBrandInitialValues
					}
					validationSchema={createBrandSchema}
					onSubmit={updateBrand}
				>
					<Form className="grid gap-4">
						<DialogHeader>
							<DialogTitle>
								{mode === "create"
									? "افزودن برند"
									: "ویرایش برند"}
							</DialogTitle>
						</DialogHeader>
						<div className="flex gap-2">
							<Input
								name="name"
								icon={Package}
								label="نام فارسی برند"
							/>
							<Input
								name="slug"
								icon={Globe}
								label="نام انگلیسی برند"
							/>
						</div>
						<Textarea
							name="description"
							icon={List}
							label="توضیحات برند"
						/>
						<Checkbox name="isActive" label="برند فعال است" />
						<ImageCropModal name="brandPic" label="تصویر برند" />
						{/* </DialogBody> */}
						<StickyDialogFooter>
							<div className="flex gap-4">
								<Button
									onClick={() => setBrandDialogOpen(false)}
									type="button"
								>
									انصراف
								</Button>
								<Button
									className="bg-primary-rose hover:bg-primary-rose/80 text-black"
									type="submit"
									loading={loading}
								>
									{mode === "create" ? "افزودن" : "ویرایش"}
								</Button>
							</div>
						</StickyDialogFooter>
					</Form>
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

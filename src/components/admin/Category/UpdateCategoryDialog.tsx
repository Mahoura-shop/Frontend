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
	createCategoryInitialValues,
	createCategorySchema,
} from "@/schemas/CategorySchemas";
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

export default function UpdateCategoryDialog({
	category,
	fetchCategories,
	mode = "create",
}: {
	category?: Category;
	fetchCategories: () => void;
	mode: "update" | "create";
}) {
	const [categoryDialogOpen, setCategoryDialogOpen] =
		useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const updateCategory = async (
		values: Category,
		{ setErrors }: { setErrors: any },
	) => {
		setLoading(true);
		const formData = new FormData();
		if (!(mode === "update" && category?.name === values.name)) {
			formData.append("name", values.name);
		}
		if (!(mode === "update" && category?.slug === values.slug)) {
			formData.append("slug", values.slug);
		}
		if (
			!(mode === "update" && category?.description === values.description)
		) {
			formData.append("description", values.description || "");
		}
		// if (!(mode === "update" && category?.isActive === values.isActive)) {
		// }
		formData.append("isActive", values.isActive.toString());
		if (
			values.categoryPic &&
			!(mode === "update" && category?.categoryPic === values.categoryPic)
		) {
			// Convert base64 string to Blob/File
			const base64Response = await fetch(values.categoryPic);
			const blob = await base64Response.blob();

			// Create a File object from the Blob
			const file = new File([blob], `category-${Date.now()}.jpg`, {
				type: "image/jpeg",
			});

			formData.append("categoryPic", file);
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
			endPoint: `/v1/category${mode === "update" ? "/" + category?.id : ""}`,
			data: formData,
		})
			.then((data) => {
				CustomToast(data.message, "success");
				setCategoryDialogOpen(false);
				fetchCategories();
			})
			.catch((error) => {
				console.log(
					"error",
					translateErrorObject(error.response.data.messages),
				);
					setErrors(
						translateErrorObject(error.response.data.messages),
					);
			})
			.finally(() => setLoading(false));
	};
	return (
		<Dialog
			open={categoryDialogOpen}
			onOpenChange={(value: boolean) => setCategoryDialogOpen(value)}
		>
			<DialogTrigger>
				{mode === "create" ? (
					<Button className="gap-2">
						<Plus className="w-4 h-4" />
						<p>
							{mode === "create"
								? "افزودن دسته‌بندی"
								: "ویرایش دسته‌بندی"}
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
			<DialogContent>
				<Formik
					initialValues={
						mode === "create"
							? createCategoryInitialValues
							: category
					}
					validationSchema={createCategorySchema}
					onSubmit={updateCategory}
				>
					<Form className="grid gap-4">
						<DialogHeader>
							<DialogTitle>
								{mode === "create"
									? "افزودن دسته‌بندی"
									: "ویرایش دسته‌بندی"}
							</DialogTitle>
						</DialogHeader>
						<div className="flex gap-2">
							<Input
								name="name"
								icon={Package}
								label="نام فارسی دسته‌بندی"
							/>
							<Input
								name="slug"
								icon={Globe}
								label="نام انگلیسی دسته‌بندی"
							/>
						</div>
						<Textarea
							name="description"
							icon={List}
							label="توضیحات دسته‌بندی"
						/>
						<div className="flex gap-2">
							<Checkbox name="isActive" />
							<p>این دسته‌بندی فعال است</p>
						</div>
						<ImageCropModal
							name="categoryPic"
							label="تصویر دسته‌بندی"
						/>
						{/* </DialogBody> */}
						<StickyDialogFooter>
							<div className="flex gap-4">
								<Button
									onClick={() => setCategoryDialogOpen(false)}
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

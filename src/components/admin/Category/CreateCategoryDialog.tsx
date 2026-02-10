"use client";
import React, { useState } from "react";
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
	Package,
	PersonStanding,
	Plus,
} from "lucide-react";
import Input from "@/components/Custom/Input/Input";
import Textarea from "@/components/Custom/Textarea/Textarea";
import Checkbox from "@/components/Custom/Checkbox/Checkbox";
import ImageCropModal from "../ImageCropModal";
import StickyDialogFooter from "@/components/StickyDialogFooter/StickyDialogFooter";
import { postData, postImageData } from "@/services/services";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import Button from "@/components/Custom/Button/Button";

export default function CreateCategoryDialog({
	fetchCategories,
}: {
	fetchCategories: () => {};
}) {
	const [crateCategoryDialogOpen, setCrateCategoryDialogOpen] =
		useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const createCategory = async (values: Category) => {
		setLoading(true);
		console.log("values", values);
		const formData = new FormData();
		formData.append("name", values.name);
		formData.append("slug", values.slug);
		formData.append("description", values.description || "");
		formData.append("isActive", values.isActive.toString());
		if (values.categoryPic) {
			// Convert base64 string to Blob/File
			const base64Response = await fetch(values.categoryPic);
			const blob = await base64Response.blob();

			// Create a File object from the Blob
			const file = new File([blob], `category-${Date.now()}.jpg`, {
				type: "image/jpeg",
			});

			formData.append("categoryPic", file);
		}
		for (let [key, value] of formData.entries()) {
			console.log(
				key,
				value instanceof File ? `File: ${value.name}` : value,
			);
		}
		postImageData({ endPoint: `/v1/category`, data: formData })
			.then((data) => {
				CustomToast(data.message, "success");
				setCrateCategoryDialogOpen(false);
				fetchCategories();
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	};
	return (
		<Dialog
			open={crateCategoryDialogOpen}
			onOpenChange={(value: boolean) => setCrateCategoryDialogOpen(value)}
		>
			<DialogTrigger>
				<Button className="gap-2">
					<Plus className="w-4 h-4" />
					افزودن دسته‌بندی
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Formik
					initialValues={createCategoryInitialValues}
					validationSchema={createCategorySchema}
					onSubmit={createCategory}
				>
					{({ isSubmitting }: { isSubmitting: boolean }) => (
						<Form className="grid gap-4">
							<DialogHeader>
								<DialogTitle>افزودن دسته‌بندی</DialogTitle>
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
								<Checkbox
									name="isActive"
									// checked={isActive}
									// onChange={() => setIsActive((pre) => !pre)}
								/>
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
										onClick={() =>
											setCrateCategoryDialogOpen(false)
										}
									>
										انصراف
									</Button>
									<Button
										className="bg-primary-rose hover:bg-primary-rose/80 text-black"
										type="submit"
										loading={loading}
									>
										افزودن
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

"use client";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Formik, Form } from "formik";
import {
	createCategoryInitialValues,
	createCategorySchema,
} from "@/schemas/CategorySchemas";
import { Globe, List, Pencil, Package, Plus } from "lucide-react";
import Input from "@/components/Custom/Input/Input";
import Textarea from "@/components/Custom/Textarea/Textarea";
import Checkbox from "@/components/Custom/Checkbox/Checkbox";
import ImageCropModal from "../ImageCropModal";
import StickyDialogFooter from "@/components/StickyDialogFooter/StickyDialogFooter";
import { postImageData, putImageData } from "@/services/services";
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
	const isMobile = useIsMobile();
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
		formData.append("isActive", values.isActive.toString());
		if (
			values.categoryPic &&
			!(mode === "update" && category?.categoryPic === values.categoryPic)
		) {
			const base64Response = await fetch(values.categoryPic);
			const blob = await base64Response.blob();
			const file = new File([blob], `category-${Date.now()}.jpg`, {
				type: "image/jpeg",
			});
			formData.append("categoryPic", file);
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
				setErrors(translateErrorObject(error.response.data.messages));
			})
			.finally(() => setLoading(false));
	};

	const title = mode === "create" ? "افزودن دسته‌بندی" : "ویرایش دسته‌بندی";
	const submitLabel = mode === "create" ? "افزودن" : "ویرایش";

	const triggerButton =
		mode === "create" ? (
			<Button className="gap-2" data-testid="create">
				<Plus className="w-4 h-4" />
				<p>{title}</p>
			</Button>
		) : (
			<Button
				size="icon"
				variant="secondary"
				className="h-8 w-8 hover:bg-background/80"
			>
				<Pencil className="w-4 h-4" />
			</Button>
		);

	const formContent = (
		<Formik
			initialValues={
				mode === "create"
					? createCategoryInitialValues
					: category || createCategoryInitialValues
			}
			validationSchema={createCategorySchema}
			onSubmit={updateCategory}
		>
			<Form className="grid gap-4">
				{isMobile ? (
					<DrawerHeader className="px-0 pt-2">
						<DrawerTitle>{title}</DrawerTitle>
					</DrawerHeader>
				) : (
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Input
						name="name"
						icon={Package}
						label="نام فارسی دسته‌بندی"
						data-testid="persian"
					/>
					<Input
						name="slug"
						icon={Globe}
						label="نام انگلیسی دسته‌بندی"
						data-testid="english"
					/>
				</div>

				<Textarea
					name="description"
					icon={List}
					label="توضیحات دسته‌بندی"
				/>

				<Checkbox name="isActive" label="دسته‌بندی فعال است" />

				<ImageCropModal name="categoryPic" label="تصویر دسته‌بندی" />

				{isMobile ? (
					<div className="sticky bottom-0 py-4 bg-background flex flex-col gap-2 z-10">
						<Button
							className="bg-primary-rose hover:bg-primary-rose/80 text-black w-full"
							type="submit"
							loading={loading}
						>
							{submitLabel}
						</Button>
						<Button
							onClick={() => setCategoryDialogOpen(false)}
							type="button"
							variant="outline"
							className="w-full"
						>
							انصراف
						</Button>
					</div>
				) : (
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
								data-testid="submit"
								loading={loading}
							>
								{submitLabel}
							</Button>
						</div>
					</StickyDialogFooter>
				)}
			</Form>
		</Formik>
	);

	if (isMobile) {
		return (
			<Drawer
				open={categoryDialogOpen}
				onOpenChange={(value: boolean) => setCategoryDialogOpen(value)}
			>
				<DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
				<DrawerContent className="max-h-[90vh]">
					<div className="flex-1 overflow-y-auto overscroll-contain px-4">
						{formContent}
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog
			open={categoryDialogOpen}
			onOpenChange={(value: boolean) => setCategoryDialogOpen(value)}
		>
			<DialogTrigger>{triggerButton}</DialogTrigger>
			<DialogContent variant="action">{formContent}</DialogContent>
		</Dialog>
	);
}

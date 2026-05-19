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
	createBrandInitialValues,
	createBrandSchema,
} from "@/schemas/BrandSchemas";
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

export default function UpdateBrandDialog({
	brand,
	fetchBrands,
	mode = "create",
}: {
	brand?: Brand;
	fetchBrands: () => void;
	mode: "update" | "create";
}) {
	const isMobile = useIsMobile();
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
		formData.append("isActive", values.isActive.toString());
		if (
			values.brandPic &&
			!(mode === "update" && brand?.brandPic === values.brandPic)
		) {
			const base64Response = await fetch(values.brandPic);
			const blob = await base64Response.blob();
			const file = new File([blob], `brand-${Date.now()}.jpg`, {
				type: "image/jpeg",
			});
			formData.append("brandPic", file);
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
				setErrors(translateErrorObject(error.response.data.messages));
			})
			.finally(() => setLoading(false));
	};

	const title = mode === "create" ? "افزودن برند" : "ویرایش برند";
	const submitLabel = mode === "create" ? "افزودن" : "ویرایش";

	const triggerButton =
		mode === "create" ? (
			<Button className="gap-2">
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
					? createBrandInitialValues
					: brand || createBrandInitialValues
			}
			validationSchema={createBrandSchema}
			onSubmit={updateBrand}
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
							onClick={() => setBrandDialogOpen(false)}
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
				open={brandDialogOpen}
				onOpenChange={(value: boolean) => setBrandDialogOpen(value)}
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
			open={brandDialogOpen}
			onOpenChange={(value: boolean) => setBrandDialogOpen(value)}
		>
			<DialogTrigger>{triggerButton}</DialogTrigger>
			<DialogContent variant="action">{formContent}</DialogContent>
		</Dialog>
	);
}

"use client";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import {
	createCategoryInitialValues,
	createCategorySchema,
} from "@/schemas/CategorySchemas";
import { MapPin, PersonStanding, Plus } from "lucide-react";
import Input from "@/components/Custom/Input/Input";

export default function CreateCategoryDialog() {
	const [open, setOpen] = useState<boolean>(false);
	const createCategory = () => {};
	return (
		<Dialog open={open} onOpenChange={(value) => setOpen(value)}>
			<DialogTrigger>
				<Button className="gap-2">
					<Plus className="w-4 h-4" />
					افزودن دسته‌بندی
				</Button>
			</DialogTrigger>
			<Formik
				initialValues={createCategoryInitialValues}
				validationSchema={createCategorySchema}
				onSubmit={createCategory}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>افزودن دسته‌بندی</DialogTitle>
					</DialogHeader>
					<Input name="name" icon={MapPin}>نام فارسی محصول</Input>
					<DialogFooter>
						<div className="flex gap-4">
							<Button onClick={() => setOpen(false)}>
								انصراف
							</Button>
							<Button className="bg-primary-rose hover:bg-primary-rose/80 text-black">
								افزودن
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Formik>
		</Dialog>
	);
}

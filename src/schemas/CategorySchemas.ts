import * as Yup from "yup";

export const createCategorySchema = Yup.object({
	name: Yup.string().required("نام دسته‌بندی الزامی است"),
	slug: Yup.string()
		.required("نام انگلیسی دسته‌بندی الزامی است")
		.matches(
			/^[a-zA-Z0-9-_\s]+$/,
			"فقط حروف انگلیسی و اعداد مجاز است",
		),
	description: Yup.string(),
	isActive: Yup.bool().required("وضعیت فعال بودن دسته‌بندی الزامی است"),
	categoryPic: Yup.mixed()
		.nullable()
});

export const createCategoryInitialValues = {
	id: 0,
	name: "",
	slug: "",
	description: "",
	isActive: false,
	categoryPic: null,
	count: 0,
};

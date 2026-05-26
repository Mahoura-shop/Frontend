import * as Yup from "yup";

export const createBrandSchema = Yup.object({
	name: Yup.string().required("نام برند الزامی است"),
	slug: Yup.string()
		.required("نام انگلیسی برند الزامی است")
		.matches(/^[a-zA-Z0-9-_\s]+$/, "فقط حروف انگلیسی و اعداد مجاز است"),
	description: Yup.string(),
	isActive: Yup.bool().required("وضعیت فعال بودن برند الزامی است"),
	brandPic: Yup.mixed().nullable(),
});

export const createBrandInitialValues = {
	id: 0,
	name: "",
	slug: "",
	description: "",
	count: 0,
	isActive: false,
	brandPic: null,
};

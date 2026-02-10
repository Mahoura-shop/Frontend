import * as Yup from "yup";

export const createCategorySchema = Yup.object({
	name: Yup.string().required("نام دسته‌بندی الزامی است"),
	slug: Yup.string().required("نام انگلیسی دسته‌بندی الزامی است"),
	description: Yup.string().max(500, "توضیحات نباید بیشتر از 500 حرف باشد"),
	isActive: Yup.bool().required("وضعیت فعال بودن دسته‌بندی الزامی است"),
	categoryPic: Yup.mixed()
		.nullable()
		.test(
			"fileSize",
			"حجم فایل بسیار زیاد است",
			(value) => !value || (value && value.size <= 5 * 1024 * 1024), // 5MB
		)
		.test(
			"fileType",
			"فرمت فایل پشتیبانی نمی‌شود",
			(value) =>
				!value ||
				(value &&
					[
						"image/jpeg",
						"image/png",
						"image/jpg",
						"image/webp",
					].includes(value.type)),
		),
});

export const createCategoryInitialValues = {
	name: "",
	slug: "",
	description: "",
	isActive: true,
	categoryPic: null,
};

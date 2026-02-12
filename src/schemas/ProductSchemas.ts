import * as Yup from "yup";

export const createProductInitialValues = {
	id: 0,
	name: "",
	slug: "",
	price: null,
	description: "",
	isActive: true,
	isNew: false,
	priority: 0,
	minOrder: 1,
	categoryID: "",
	brandID: "",
	quantity: 0,
	quantityType: "عدد",
	foreign: false,
	currencyCode: "IRR",
	productPic: undefined,
};

export const createProductSchema = Yup.object({
	name: Yup.string()
		.required("نام محصول الزامی است")
		.max(50, "نام محصول نباید بیشتر از ۵۰ کاراکتر باشد"),
	slug: Yup.string()
		.required("نام انگلیسی الزامی است")
		.max(50, "نام انگلیسی نباید بیشتر از ۵۰ کاراکتر باشد")
		.matches(
			/^[a-zA-Z0-9-|\s]+$/,
			"نام انگلیسی فقط باید شامل حروف انگلیسی، اعداد و خط تیره باشد",
		),
	price: Yup.number()
		.required("قیمت الزامی است")
		.min(0, "قیمت نمی‌تواند منفی باشد"),
	description: Yup.string(),
	isActive: Yup.boolean(),
	foreign: Yup.boolean(),
	isNew: Yup.boolean(),
	priority: Yup.number().min(0, "اولویت نمی‌تواند منفی باشد"),
	minOrder: Yup.number().min(1, "حداقل سفارش باید حداقل ۱ باشد"),
	categoryID: Yup.string().nullable(),
	brandID: Yup.string().nullable(),
	quantity: Yup.number()
		.required("موجودی الزامی است")
		.min(0, "موجودی نمی‌تواند منفی باشد"),
	quantityType: Yup.string().required("واحد شمارش الزامی است"),
	currencyCode: Yup.string()
		.required("واحد پول الزامی است")
		.max(5, "کد ارز نباید بیشتر از ۵ کاراکتر باشد"),
	productPic: Yup.string().nullable(),
});

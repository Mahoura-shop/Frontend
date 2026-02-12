import * as Yup from "yup";

export const createProductInitialValues = {
	id: 0,
	name: "",
	slug: "",
	description: "",
	price: undefined,
	isActive: true,
	isNew: true,
	priority: 0,
	minOrder: 1,
	categoryID: "",
	irrPrice: undefined,
	consumerPrice: undefined,
	step1Percent: undefined,
	step2Percent: undefined,
	step3Percent: undefined,
	step1Price: undefined,
	step2Price: undefined,
	step3Price: undefined,
	brandID: "",
	quantity: 0,
	quantityType: "عدد",
	// foreign: false,
	currencyID: "1",
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
	description: Yup.string(),
	isActive: Yup.boolean(),
	irrPrice: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	consumerPrice: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	step1Percent: Yup.number()
		.optional()
		.min(-100, "درصد نمیتواند کمتر از 100- باشد")
		.max(100, "درصد نمیتواند بیشتر از 100 باشد"),
	step2Percent: Yup.number()
		.optional()
		.min(-100, "درصد نمیتواند کمتر از 100- باشد")
		.max(100, "درصد نمیتواند بیشتر از 100 باشد"),
	step3Percent: Yup.number()
		.optional()
		.min(-100, "درصد نمیتواند کمتر از 100- باشد")
		.max(100, "درصد نمیتواند بیشتر از 100 باشد"),
	step1Price: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	step2Price: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	step3Price: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	// foreign: Yup.boolean(),
	isNew: Yup.boolean(),
	priority: Yup.number().min(0, "اولویت نمی‌تواند منفی باشد"),
	minOrder: Yup.number().min(1, "حداقل سفارش باید حداقل ۱ باشد"),
	categoryID: Yup.string().nullable(),
	brandID: Yup.string().nullable(),
	quantity: Yup.number()
		.required("موجودی الزامی است")
		.min(0, "موجودی نمی‌تواند منفی باشد"),
	quantityType: Yup.string().required("واحد شمارش الزامی است"),
	currencyID: Yup.number().required("واحد پول الزامی است"),
	productPic: Yup.string().nullable(),
});

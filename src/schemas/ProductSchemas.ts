import * as Yup from "yup";

export const createProductInitialValues = {
	id: 0,
	name: "",
	slug: "",
	description: "",
	offer: "",
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
	step4Percent: undefined,
	step1Price: undefined,
	step2Price: undefined,
	step3Price: undefined,
	step4Price: undefined,
	step1Origin: false,
	step2Origin: false,
	step3Origin: false,
	step4Origin: false,
	brandID: "",
	quantity: 0,
	quantityType: "عدد",
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
	offer: Yup.string(),
	isActive: Yup.boolean(),
	irrPrice: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	consumerPrice: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	step1Percent: Yup.number()
		.optional(),
	step2Percent: Yup.number()
		.optional(),
	step3Percent: Yup.number()
		.optional(),
	step4Percent: Yup.number()
		.optional(),
	step1Price: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	step2Price: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	step3Price: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	step4Price: Yup.number().optional().min(0, "قیمت نمی‌تواند منفی باشد"),
	step1Origin: Yup.boolean(),
	step2Origin: Yup.boolean(),
	step3Origin: Yup.boolean(),
	step4Origin: Yup.boolean(),
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

export const updateProductPriceSchema = Yup.object({
	id: Yup.number().required("شناسه محصول الزامی است"),
	irrPrice: Yup.number().required("قیمت جدید محصول الزامی است"),
});

import * as Yup from 'yup';

export const createProductInitialValues = {
	name: '',
	slug: '',
	price: 0,
	description: '',
	isActive: true,
	isNew: false,
	priority: 0,
	minOrder: 1,
	categoryID: null,
	brandID: null,
	quantity: 0,
	quantityType: 'pieces',
	currencyCode: 'IRR',
	productPic: null,
};

export const createProductSchema = Yup.object({
	name: Yup.string()
		.required('نام محصول الزامی است')
		.max(50, 'نام محصول نباید بیشتر از ۵۰ کاراکتر باشد'),
	slug: Yup.string()
		.required('شناسه URL الزامی است')
		.max(50, 'شناسه URL نباید بیشتر از ۵۰ کاراکتر باشد')
		.matches(/^[a-z0-9-]+$/, 'شناسه URL فقط باید شامل حروف انگلیسی کوچک، اعداد و خط تیره باشد'),
	price: Yup.number()
		.required('قیمت الزامی است')
		.min(0, 'قیمت نمی‌تواند منفی باشد'),
	description: Yup.string(),
	isActive: Yup.boolean(),
	isNew: Yup.boolean(),
	priority: Yup.number()
		.min(0, 'اولویت نمی‌تواند منفی باشد'),
	minOrder: Yup.number()
		.min(1, 'حداقل سفارش باید حداقل ۱ باشد'),
	categoryID: Yup.number().nullable(),
	brandID: Yup.number().nullable(),
	quantity: Yup.number()
		.required('موجودی الزامی است')
		.min(0, 'موجودی نمی‌تواند منفی باشد'),
	quantityType: Yup.string()
		.required('واحد شمارش الزامی است')
		.oneOf(['pieces', 'ml', 'g', 'kg', 'l'], 'واحد شمارش نامعتبر است'),
	currencyCode: Yup.string()
		.required('واحد پول الزامی است')
		.max(5, 'کد ارز نباید بیشتر از ۵ کاراکتر باشد'),
	productPic: Yup.string().nullable(),
});
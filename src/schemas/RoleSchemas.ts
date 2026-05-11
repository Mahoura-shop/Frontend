import * as Yup from "yup"

export const roleSchema = Yup.object({
	name: Yup.string().required("نام نقش الزامی است"),
	description: Yup.string().max(255, "توضیحات نباید بیشتر از ۲۵۵ حرف باشد"),
})

export const roleInitialValues = {
	name: "",
	description: "",
}

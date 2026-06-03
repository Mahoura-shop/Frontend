"use client";
import { useEffect, useState } from "react";
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
	createProductInitialValues,
	createProductSchema,
} from "@/schemas/ProductSchemas";
import {
	Globe,
	List,
	Pencil,
	Package,
	Plus,
	DollarSign,
	Hash,
	ShoppingCart,
	TrendingUp,
	FolderTree,
	Tag,
	Copy,
	Percent,
	PercentCircle,
	TicketPercent,
	ShoppingBag,
	UserStar,
	HandCoins,
	Banknote,
	AlertTriangle,
} from "lucide-react";
import Input from "@/components/Custom/Input/Input";
import Textarea from "@/components/Custom/Textarea/Textarea";
import Checkbox from "@/components/Custom/Checkbox/Checkbox";
import ImageCropModal from "../ImageCropModal";
import StickyDialogFooter from "@/components/StickyDialogFooter/StickyDialogFooter";
import { getData, postImageData, putImageData } from "@/services/services";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import Button from "@/components/Custom/Button/Button";
import { translateErrorObject } from "@/utils/translateErrorObject";
import Select from "@/components/Custom/Select/Select";
import { roundPrice } from "@/utils/roundPrice";
import { useCurrencyStore } from "@/store/useCurrencyStore";

interface UpdateProductDialogProps {
	product?: Product;
	fetchProducts: () => void;
	mode: "update" | "create" | "copy";
	categories?: Array<{ id: number; name: string }>;
	brands?: Array<{ id: number; name: string }>;
}

interface ProductFormProps {
	product?: Product;
	fetchProducts: () => void;
	mode: "update" | "create" | "copy";
	categories: Array<{ id: number; name: string }>;
	brands: Array<{ id: number; name: string }>;
	currencies: Currency[];
	onClose: () => void;
	isMobile: boolean;
}

function ProductForm({
	product,
	fetchProducts,
	mode,
	categories,
	brands,
	currencies,
	onClose,
	isMobile,
}: ProductFormProps) {
	const [loading, setLoading] = useState<boolean>(false);

	const updateProduct = async (
		values: Product,
		{ setErrors }: { setErrors: any },
	) => {
		setLoading(true);
		const formData = new FormData();

		if (!(mode === "update" && product?.externalID === values.externalID)) {
			if (values.externalID) {
				formData.append("externalID", values.externalID);
			}
		}
		if (!(mode === "update" && product?.name === values.name)) {
			formData.append("name", values.name);
		}
		if (!(mode === "update" && product?.slug === values.slug)) {
			formData.append("slug", values.slug);
		}
		if (
			!(mode === "update" && product?.price === values.price) &&
			values.price
		) {
			formData.append("price", values.price.toString());
		}
		if (
			!(mode === "update" && product?.description === values.description)
		) {
			formData.append("description", values.description || "");
		}
		if (!(mode === "update" && product?.offer === values.offer)) {
			formData.append("offer", values.offer || "");
		}
		formData.append("isActive", values.isActive.toString());
		formData.append("isNew", values.isNew.toString());

		if (!(mode === "update" && product?.priority === values.priority)) {
			formData.append("priority", (values.priority || 0).toString());
		}
		if (!(mode === "update" && product?.minOrder === values.minOrder)) {
			formData.append("minOrder", (values.minOrder || 1).toString());
		}
		if (!(mode === "update" && product?.categoryID === values.categoryID)) {
			if (values.categoryID && values.categoryID !== "0") {
				formData.append("categoryID", values.categoryID.toString());
			}
		}
		if (!(mode === "update" && product?.brandID === values.brandID)) {
			if (values.brandID && values.brandID !== "0") {
				formData.append("brandID", values.brandID.toString());
			}
		}
		if (!(mode === "update" && product?.quantity === values.quantity)) {
			formData.append("quantity", values.quantity.toString());
		}
		if (
			!(
				mode === "update" &&
				product?.quantityType === values.quantityType
			)
		) {
			formData.append("quantityType", values.quantityType);
		}
		formData.append("currencyID", values.currencyID.toString());
		// if (!(mode === "update" && product?.currencyID === values.currencyID)) {
		// 	formData.append("currencyID", values.currencyID.toString());
		// }
		if (
			!(mode === "update" && product?.irrPrice === values.irrPrice) &&
			values.irrPrice
		) {
			formData.append("irrPrice", values.irrPrice?.toString());
		}
		formData.append(
			"consumerPrice",
			values.consumerPrice?.toString() ?? "",
		);
		formData.append("step1Percent", values.step1Percent?.toString() ?? "");
		formData.append("step2Percent", values.step2Percent?.toString() ?? "");
		formData.append("step3Percent", values.step3Percent?.toString() ?? "");
		formData.append("step4Percent", values.step4Percent?.toString() ?? "");
		formData.append("step1Price", values.step1Price?.toString() ?? "");
		formData.append("step2Price", values.step2Price?.toString() ?? "");
		formData.append("step3Price", values.step3Price?.toString() ?? "");
		formData.append("step4Price", values.step4Price?.toString() ?? "");
		// if (
		// 	!(
		// 		mode === "update" &&
		// 		product?.consumerPrice === values.consumerPrice
		// 	) &&
		// 	values.consumerPrice
		// ) {
		// 	formData.append("consumerPrice", values.consumerPrice?.toString());
		// }
		// if (
		// 	!(
		// 		mode === "update" &&
		// 		product?.step1Percent === values.step1Percent
		// 	) &&
		// 	values.step1Percent
		// ) {
		// 	formData.append("step1Percent", values.step1Percent?.toString());
		// }
		// if (
		// 	!(
		// 		mode === "update" &&
		// 		product?.step2Percent === values.step2Percent
		// 	) &&
		// 	values.step2Percent
		// ) {
		// 	formData.append("step2Percent", values.step2Percent?.toString());
		// }
		// if (
		// 	!(
		// 		mode === "update" &&
		// 		product?.step3Percent === values.step3Percent
		// 	) &&
		// 	values.step3Percent
		// ) {
		// 	formData.append("step3Percent", values.step3Percent?.toString());
		// }
		// if (
		// 	!(
		// 		mode === "update" &&
		// 		product?.step4Percent === values.step4Percent
		// 	) &&
		// 	values.step4Percent
		// ) {
		// 	formData.append("step4Percent", values.step4Percent?.toString());
		// }
		// if (
		// 	!(mode === "update" && product?.step1Price === values.step1Price) &&
		// 	values.step1Price
		// ) {
		// 	formData.append("step1Price", values.step1Price?.toString());
		// }
		// if (
		// 	!(mode === "update" && product?.step2Price === values.step2Price) &&
		// 	values.step2Price
		// ) {
		// 	formData.append("step2Price", values.step2Price?.toString());
		// }
		// if (
		// 	!(mode === "update" && product?.step3Price === values.step3Price) &&
		// 	values.step3Price
		// ) {
		// 	formData.append("step3Price", values.step3Price?.toString());
		// }
		// if (
		// 	!(mode === "update" && product?.step4Price === values.step4Price) &&
		// 	values.step4Price
		// ) {
		// 	formData.append("step4Price", values.step4Price?.toString());
		// }
		if (
			!(
				mode === "update" && product?.step1Origin === values.step1Origin
			) &&
			values.step1Origin
		) {
			formData.append("step1Origin", values.step1Origin?.toString());
		}
		if (
			!(
				mode === "update" && product?.step2Origin === values.step2Origin
			) &&
			values.step2Origin
		) {
			formData.append("step2Origin", values.step2Origin?.toString());
		}
		if (
			!(
				mode === "update" && product?.step3Origin === values.step3Origin
			) &&
			values.step3Origin
		) {
			formData.append("step3Origin", values.step3Origin?.toString());
		}
		if (
			!(
				mode === "update" && product?.step4Origin === values.step4Origin
			) &&
			values.step4Origin
		) {
			formData.append("step4Origin", values.step4Origin?.toString());
		}

		if (
			values.productPic &&
			!(mode === "update" && product?.productPic === values.productPic)
		) {
			if (mode === "copy") {
				formData.append("productPic", values.productPic);
			} else {
				const base64Response = await fetch(values.productPic);
				const blob = await base64Response.blob();
				const file = new File([blob], `product-${Date.now()}.jpg`, {
					type: "image/jpeg",
				});
				formData.append("productPic", file);
			}
		}
		console.log(
			"Form Data Values:",
			Object.fromEntries(formData.entries()),
		);
		const apiFunc = mode === "update" ? putImageData : postImageData;
		apiFunc({
			endPoint: `/v1/product${mode === "update" ? "/" + product?.id : ""}`,
			data: formData,
		})
			.then((data) => {
				CustomToast(data.message, "success");
				onClose();
				fetchProducts();
			})
			.catch((error) => {
				setErrors(
					translateErrorObject(error?.response?.data?.messages),
				);
			})
			.finally(() => setLoading(false));
	};

	const title = mode !== "update" ? "افزودن محصول جدید" : "ویرایش محصول";
	const submitLabel = mode !== "update" ? "افزودن محصول" : "ذخیره تغییرات";

	return (
		<Formik
			initialValues={
				mode === "create" ? createProductInitialValues : product!
			}
			validationSchema={createProductSchema}
			onSubmit={updateProduct}
		>
			{({ values, setFieldValue }) => {
				const price = values["price"];
				const irrPrice = values["irrPrice"];
				const step1 = values["step1Percent"];
				const step2 = values["step2Percent"];
				const step3 = values["step3Percent"];
				const step4 = values["step4Percent"];
				const baseStep1 = values["step1Price"];
				const baseStep2 = values["step2Price"];
				const baseStep3 = values["step3Price"];
				const step2Origin = values["step2Origin"];
				const step3Origin = values["step3Origin"];
				const step4Origin = values["step4Origin"];
				const currentCurrencyId = Number(values.currencyID);
				const rate =
					currencies.find(
						(currency: Currency) =>
							currency.id === currentCurrencyId,
					)?.convertRate || 1;

				useEffect(() => {
					if (price === undefined) return;
					// if (mode === "update" && price === product?.price) return;
					console.log("price * rate", price * rate);
					setFieldValue("irrPrice", roundPrice(price * rate));
				}, [price, rate, mode, setFieldValue, values["currencyID"]]);

				useEffect(() => {
					if (!irrPrice || !step1) {
						setFieldValue("step1Price", "");
						return;
					}
					setFieldValue(
						"step1Price",
						roundPrice(irrPrice * (1 + Number(step1) / 100)),
					);
				}, [irrPrice, step1, setFieldValue]);

				useEffect(() => {
					if (step2Origin) {
						if (!irrPrice || !step2) {
							setFieldValue("step2Price", "");
							return;
						}
						setFieldValue(
							"step2Price",
							roundPrice(irrPrice * (1 + Number(step2) / 100)),
						);
					} else {
						if (!baseStep1 || !step2) {
							setFieldValue("step2Price", "");
							return;
						}
						setFieldValue(
							"step2Price",
							roundPrice(baseStep1 * (1 + Number(step2) / 100)),
						);
					}
				}, [step2Origin, irrPrice, baseStep1, step2]);

				useEffect(() => {
					if (step3Origin) {
						if (!irrPrice || !step3) {
							setFieldValue("step3Price", "");
							return;
						}
						setFieldValue(
							"step3Price",
							roundPrice(irrPrice * (1 + Number(step3) / 100)),
						);
					} else {
						if (!baseStep2 || !step3) {
							setFieldValue("step3Price", "");
							return;
						}
						setFieldValue(
							"step3Price",
							roundPrice(baseStep2 * (1 + Number(step3) / 100)),
						);
					}
				}, [step3Origin, irrPrice, baseStep2, step3]);

				useEffect(() => {
					if (step4Origin) {
						if (!irrPrice || !step4) {
							setFieldValue("step4Price", "");
							return;
						}
						setFieldValue(
							"step4Price",
							roundPrice(irrPrice * (1 + Number(step4) / 100)),
						);
					} else {
						if (!baseStep3 || !step4) {
							setFieldValue("step4Price", "");
							return;
						}
						setFieldValue(
							"step4Price",
							roundPrice(baseStep3 * (1 + Number(step4) / 100)),
						);
					}
				}, [step4Origin, irrPrice, baseStep3, step4]);

				const priceViolations = (() => {
					const s1 = Number(values.step1Price) || 0;
					const s2 = Number(values.step2Price) || 0;
					const s3 = Number(values.step3Price) || 0;
					const s4 = Number(values.step4Price) || 0;
					const cp = Number(values.consumerPrice) || 0;
					const violations: string[] = [];
					if (s1 && s2 && s1 > s2)
						violations.push(
							"قیمت همکار باید از قیمت مغازه نقدی کمتر یا مساوی باشد",
						);
					if (s2 && s3 && s2 > s3)
						violations.push(
							"قیمت مغازه نقدی باید از قیمت مغازه چکی کمتر یا مساوی باشد",
						);
					if (s3 && s4 && s3 > s4)
						violations.push(
							"قیمت مغازه چکی باید از قیمت تکی کمتر یا مساوی باشد",
						);
					if (s4 && cp && s4 > cp)
						violations.push(
							"قیمت تکی باید از قیمت مصرف کننده کمتر یا مساوی باشد",
						);
					return violations;
				})();

				return (
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

						<Input
							name="externalID"
							icon={Hash}
							label="شناسه اکسل (Excel ID)"
						/>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Input
								name="name"
								icon={Package}
								label="نام فارسی محصول"
								data-testid="persian"
							/>
							<Input
								name="slug"
								icon={Globe}
								label="نام انگلیسی محصول"
								data-testid="english"
							/>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							<Input
								name="price"
								isPriceInput
								label="قیمت"
								icon={DollarSign}
								data-testid="price"
							/>
							<Select
								name="currencyID"
								data-testid="currency"
								label="واحد پول"
								icon={DollarSign}
								options={currencies?.map(
									(currency: Currency) => ({
										value: currency.id.toString(),
										label: `${currency.name} (${currency.code})`,
									}),
								)}
							/>
							<Input
								name="irrPrice"
								isPriceInput
								icon={DollarSign}
								label="معادل ریالی"
							/>
							<Input
								name="consumerPrice"
								isPriceInput
								label="قیمت مصرف کننده"
								icon={ShoppingBag}
								data-testid="consumer-price"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Input
								name="step1Percent"
								// isPriceInput
								icon={Percent}
								label="درصد همکار"
							/>
							<Input
								name="step1Price"
								isPriceInput
								icon={UserStar}
								label="قیمت همکار"
							/>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<Input
								name="step2Percent"
								// isPriceInput
								icon={Percent}
								label="درصد مغازه نقدی"
							/>
							<Input
								name="step2Price"
								isPriceInput
								icon={HandCoins}
								label="قیمت مغازه نقدی"
							/>
							<Checkbox
								name="step2Origin"
								label="نسبت به قیمت اصلی"
							/>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<Input
								name="step3Percent"
								// isPriceInput
								icon={Percent}
								label="درصد مغازه چکی"
							/>
							<Input
								name="step3Price"
								isPriceInput
								icon={Banknote}
								label="قیمت مغازه چکی"
							/>
							<Checkbox
								name="step3Origin"
								label="نسبت به قیمت اصلی"
							/>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<Input
								name="step4Percent"
								// isPriceInput
								icon={Percent}
								label="درصد تکی"
							/>
							<Input
								name="step4Price"
								isPriceInput
								icon={PercentCircle}
								label="قیمت تکی"
							/>
							<Checkbox
								name="step4Origin"
								label="نسبت به قیمت اصلی"
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Input name="quantity" icon={Hash} label="موجودی" data-testid="inventory" />
							<Input
								name="quantityType"
								icon={ShoppingCart}
								label="واحد شمارش"
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Input
								name="priority"
								type="number"
								icon={TrendingUp}
								label="اولویت نمایش"
							/>
							<Input
								name="minOrder"
								type="number"
								icon={ShoppingCart}
								label="حداقل سفارش"
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Select
								name="categoryID"
								label="دسته‌بندی"
								data-testid="category"
								icon={FolderTree}
								helper="انتخاب دسته‌بندی"
								options={[
									{
										value: "",
										label: "انتخاب دسته‌بندی",
									},
									...(categories?.map((cat) => ({
										value: cat.id.toString(),
										label: cat.name,
									})) ?? []),
								]}
							/>
							<Select
								name="brandID"
								label="برند"
								data-testid="brand"
								icon={Tag}
								helper="انتخاب برند"
								options={[
									{ value: "", label: "انتخاب برند" },
									...(brands?.map((brand) => ({
										value: brand.id.toString(),
										label: brand.name,
									})) ?? []),
								]}
							/>
						</div>

						<Textarea
							name="description"
							icon={List}
							label="توضیحات محصول"
						/>

						<div>
							<Textarea
								name="offer"
								icon={TicketPercent}
								label="آفر"
							/>
						</div>

						<div className="flex gap-6">
							<Checkbox name="isActive" label="محصول فعال است" />
							<Checkbox name="isNew" label="محصول جدید است" />
						</div>

						<ImageCropModal name="productPic" label="تصویر محصول" />

						{priceViolations.length > 0 && (
							<div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
								<AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
								<div className="space-y-1">
									<p className="text-sm font-semibold">
										نقض ترتیب قیمت‌گذاری
									</p>
									{priceViolations.map((v, i) => (
										<p key={i} className="text-xs">
											{v}
										</p>
									))}
								</div>
							</div>
						)}

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
									onClick={onClose}
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
										onClick={onClose}
										type="button"
										variant="outline"
									>
										انصراف
									</Button>
									<Button
										className="bg-primary-rose hover:bg-primary-rose/80 text-black"
										type="submit"
										data-testid="submit"
										loading={loading}
									>
										{submitLabel}
									</Button>
								</div>
							</StickyDialogFooter>
						)}
					</Form>
				);
			}}
		</Formik>
	);
}

export default function UpdateProductDialog({
	product,
	fetchProducts,
	mode = "create",
	categories = [],
	brands = [],
}: UpdateProductDialogProps) {
	const isMobile = useIsMobile();
	const { currencies, fetchCurrencies } = useCurrencyStore();
	const [productDialogOpen, setProductDialogOpen] = useState<boolean>(false);

	useEffect(() => {
		fetchCurrencies();
	}, []);

	const triggerButton =
		mode === "create" ? (
			<Button className="gap-2" data-testid="create">
				<Plus className="w-4 h-4" />
				<p>افزودن محصول</p>
			</Button>
		) : mode === "update" ? (
			<Button
				size="icon"
				variant="secondary"
				className="h-8 w-8 hover:bg-background/80"
			>
				<Pencil className="w-4 h-4" />
			</Button>
		) : (
			<Button
				size="icon"
				variant="secondary"
				className="h-8 w-8 hover:bg-background/80"
			>
				<Copy className="w-4 h-4" />
			</Button>
		);

	const formProps = {
		product,
		fetchProducts,
		mode,
		categories,
		brands,
		currencies,
		onClose: () => setProductDialogOpen(false),
	};

	if (isMobile) {
		return (
			<Drawer
				open={productDialogOpen}
				onOpenChange={(value: boolean) => setProductDialogOpen(value)}
			>
				<DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
				<DrawerContent className="max-h-[90vh]">
					<div className="flex-1 overflow-y-auto overscroll-contain px-4">
						<ProductForm {...formProps} isMobile={true} />
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog
			open={productDialogOpen}
			onOpenChange={(value: boolean) => setProductDialogOpen(value)}
		>
			<DialogTrigger>{triggerButton}</DialogTrigger>
			<DialogContent
				className="max-w-4xl max-h-[90vh] overflow-y-auto"
				variant="action"
			>
				<ProductForm {...formProps} isMobile={false} />
			</DialogContent>
		</Dialog>
	);
}

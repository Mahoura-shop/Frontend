"use client";
import styles from "./Input.module.css";
import { AlertCircle, LucideIcon } from "lucide-react";
import { useField } from "formik";
import { cn } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettingsStore } from "@/store/useSettingsStore";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	name?: string;
	children?: React.ReactNode;
	icon?: LucideIcon;
	onIconClick?: () => void;
	autoFocus?: boolean;
	iconClassName?: string;
	errorClassName?: string;
	inputClassName?: string;
	containerClassName?: string;
	variant?: "default" | "premium" | "success";
	label: string;
	loading?: boolean;
	value?: string | number;
	onValueChange?: (value: string) => void;
}

const isRTL = (text: string | undefined): boolean => {
	if (!text) return true;
	const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
	return rtlChars.test(text);
};

export default function Input({
	name,
	children,
	icon: Icon,
	onIconClick,
	autoFocus = false,
	iconClassName,
	errorClassName,
	inputClassName,
	value,
	containerClassName,
	variant = "default",
	loading = false,
	onValueChange,
	label,
	...props
}: Props) {
	// const [field, meta] = useField(name as string);
	// const usingFormik = name ? true : false;

	// const { formatPrice } = useSettingsStore();
	const usingFormik = !!name;
	let field: any = {};
	let meta: any = {};
	if (usingFormik) {
		[field, meta] = useField({ name });
	}

	const hasError = meta.touched && meta.error;

	const actualValue = usingFormik ? (field.value ?? "") : (value ?? "");

	const direction = isRTL(actualValue) ? "rtl" : "ltr";

	return (
		<div
			className={cn(styles.Conter, containerClassName, "font-vazirmatn")}
		>
			<div className={styles.inputWrapper}>
				<input
					dir={direction}
					{...(usingFormik ? field : {})}
					{...props}
					autoFocus={autoFocus}
					value={actualValue}
					// value={
					// 	props.type === "number"
					// 		? formatPrice(Number(actualValue))
					// 		: actualValue
					// }
					placeholder=" "
					disabled={loading || props.disabled} // Disable when loading
					className={cn(
						"font-vazirmatn",
						styles.Input,
						props.type === "number" && styles.numberInput,
						usingFormik && hasError && styles.error,
						variant === "premium" && styles.premium,
						variant === "success" && styles.success,
						loading && styles.loading,
						inputClassName,
					)}
					onChange={(e) => {
						const newValue = e.target.value;
						if (usingFormik && "onChange" in field) {
							field.onChange(e);
						}
						onValueChange?.(newValue);
					}}
				/>

				{/* Floating Label */}
				{label && (
					<label
						className={cn(
							styles.text,
							errorClassName,
							"font-vazirmatn",
						)}
					>
						{label}
					</label>
				)}

				{/* Icon */}

				{usingFormik ? (
					Icon ? (
						hasError ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<Icon
										onClick={onIconClick}
										className={cn(
											styles.icon,
											iconClassName,
										)}
									/>
								</TooltipTrigger>
								<TooltipContent className="rtl">
									<p>{meta.error}</p>
								</TooltipContent>
							</Tooltip>
						) : (
							<Icon
								onClick={onIconClick}
								className={cn(styles.icon, iconClassName)}
							/>
						)
					) : (
						hasError && (
							<Tooltip>
								<TooltipTrigger asChild>
									<AlertCircle
										onClick={onIconClick}
										className={cn(
											styles.icon,
											iconClassName,
										)}
									/>
								</TooltipTrigger>
								<TooltipContent className="rtl">
									<p>{meta.error}</p>
								</TooltipContent>
							</Tooltip>
						)
					)
				) : (
					Icon && (
						<Icon
							onClick={onIconClick}
							className={cn(styles.icon, iconClassName)}
						/>
					)
				)}

				{/* Error Message */}
				{/* {hasError && (
					<div className={styles.errorMessage}>{meta.error}</div>
				)} */}
			</div>
		</div>
	);
}

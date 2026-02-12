"use client";
import style from "./Textarea.module.css";
import { AlertCircle, LucideIcon } from "lucide-react";

import { useField } from "formik";
import { cn } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
	name: string;
	children?: React.ReactNode;
	icon?: LucideIcon;
	onIconClick?: () => void;
	autoFocus?: boolean;
	iconClassName?: string;
	errorClassName?: string;
	inputClassName?: string;
	containerClassName?: string;
	onlyNumbers?: boolean;
	variant?: "default" | "premium" | "success"; // Add variant prop
	label: string;
	loading?: boolean; // Add loading prop
}

const isRTL = (text: string | undefined): boolean => {
	if (!text) return true;
	const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
	return rtlChars.test(text);
};

export default function Textarea({
	name,
	children,
	icon: Icon,
	onIconClick,
	autoFocus = false,
	iconClassName,
	errorClassName,
	inputClassName,
	containerClassName,
	onlyNumbers = false,
	variant = "default",
	loading = false,
	label,
	...props
}: Props) {
	const [field, meta] = useField(name);
	const hasError = meta.touched && meta.error;
	const value = field.value || "";
	const direction = isRTL(value) ? "rtl" : "ltr";

	return (
		<div className={cn(style.Conter, containerClassName, "font-vazirmatn")}>
			<div className={style.inputWrapper}>
				<textarea
					dir={direction}
					{...field}
					{...props}
					autoFocus={autoFocus}
					placeholder=" "
					disabled={loading || props.disabled} // Disable when loading
					className={cn(
						"font-vazirmatn min-h-12",
						style.Input,
						onlyNumbers && style.numberInput,
						hasError && style.error,
						variant === "premium" && style.premium,
						variant === "success" && style.success,
						loading && style.loading,
						inputClassName,
					)}
					onChange={(e) => {
						const newValue = e.target.value;
						if (
							(onlyNumbers && /^\d*$/.test(newValue)) ||
							!onlyNumbers
						) {
							field.onChange(e);
						}
					}}
				/>

				{/* Floating Label */}
				{label && (
					<label
						className={cn(
							style.text,
							errorClassName,
							"font-vazirmatn",
						)}
					>
						{label}
					</label>
				)}

				{/* Icon */}
				{Icon ? (
					hasError ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<Icon
									onClick={onIconClick}
									className={cn(style.icon, iconClassName)}
								/>
							</TooltipTrigger>
							<TooltipContent className="rtl">
								<p>{meta.error}</p>
							</TooltipContent>
						</Tooltip>
					) : (
						<Icon
							onClick={onIconClick}
							className={cn(style.icon, iconClassName)}
						/>
					)
				) : (
					hasError && (
						<Tooltip>
							<TooltipTrigger asChild>
								<AlertCircle
									onClick={onIconClick}
									className={cn(style.icon, iconClassName)}
								/>
							</TooltipTrigger>
							<TooltipContent className="rtl">
								<p>{meta.error}</p>
							</TooltipContent>
						</Tooltip>
					)
				)}

				{/* Error Message */}
				{/* {hasError && (
					<div className={style.errorMessage}>{meta.error}</div>
				)} */}
			</div>
		</div>
	);
}

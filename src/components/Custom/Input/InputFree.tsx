"use client";
import styles from "./Input.module.css";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	children?: React.ReactNode;
	icon?: LucideIcon;
	onIconClick?: () => void;
	autoFocus?: boolean;
	iconClassName?: string;
	errorClassName?: string;
	inputClassName?: string;
	containerClassName?: string;
	variant?: "default" | "premium" | "success"; // Add variant prop
	label: string;
	loading?: boolean; // Add loading prop
	value?: string | number;
	onValueChange?: (value: string) => void;
}

const isRTL = (text: string | undefined): boolean => {
	if (!text) return true;
	const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
	return rtlChars.test(text);
};

export default function InputFree({
	children,
	icon: Icon,
	onIconClick,
	autoFocus = false,
	iconClassName,
	errorClassName,
	inputClassName,
	containerClassName,
	variant = "default",
	loading = false,
	label,
	value,
	onValueChange,
	...props
}: Props) {
	const { formatPrice } = useSettingsStore();
	const direction =
		typeof value === "string" ? (isRTL(value) ? "rtl" : "ltr") : "ltr";

	return (
		<div
			className={cn(styles.Conter, containerClassName, "font-vazirmatn")}
		>
			<div className={styles.inputWrapper}>
				<input
					dir={direction}
					{...props}
					autoFocus={autoFocus}
					// value={value}
					value={
						value
					}
					placeholder=" "
					disabled={loading || props.disabled} // Disable when loading
					className={cn(
						"font-vazirmatn",
						styles.Input,
						props.type === "number" && styles.numberInput,
						variant === "premium" && styles.premium,
						variant === "success" && styles.success,
						loading && styles.loading,
						inputClassName,
					)}
					onChange={(e) => {
						if (onValueChange) {
							const newValue = e.target.value;
							onValueChange(newValue);
						}
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
				{Icon && (
					<Icon
						onClick={onIconClick}
						className={cn(styles.icon, iconClassName)}
					/>
				)}

				{/* Error Message */}
				{/* {hasError && (
					<div className={styles.errorMessage}>{meta.error}</div>
				)} */}
			</div>
		</div>
	);
}

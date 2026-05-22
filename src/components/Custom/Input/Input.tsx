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
import { isRTL } from "@/utils/isRTL";
import { formatPrice as formatPriceUtil } from "@/utils/formatPrice";
import { persianToAscii } from "@/utils/translateNumber";
import React, { useCallback, useRef, useState, useEffect } from "react";

interface FormikInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label: string;
	icon?: LucideIcon;
	onIconClick?: () => void;
	iconClassName?: string;
	errorClassName?: string;
	inputClassName?: string;
	containerClassName?: string;
	variant?: "default" | "premium" | "success";
	loading?: boolean;
	isPriceInput?: boolean;
	onValueChange?: (value: string) => void;
}

interface RawInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	value?: string | number | null;
	onValueChange?: (value: string) => void;
	icon?: LucideIcon;
	onIconClick?: () => void;
	iconClassName?: string;
	errorClassName?: string;
	inputClassName?: string;
	containerClassName?: string;
	variant?: "default" | "premium" | "success";
	loading?: boolean;
	error?: string;
	isPriceInput?: boolean;
}

type MergedInputProps = FormikInputProps | RawInputProps;

const RawInput = React.forwardRef<HTMLInputElement, RawInputProps>(
	function RawInput(
		{
			label,
			value,
			onValueChange,
			icon: Icon,
			onIconClick,
			iconClassName,
			errorClassName,
			inputClassName,
			containerClassName,
			variant = "default",
			loading = false,
			error,
			isPriceInput = false,
			autoFocus = false,
			disabled,
			...props
		},
		ref,
	) {
		const inputRef = useRef<HTMLInputElement>(null);
		React.useImperativeHandle(ref, () => inputRef.current!);

		const formatPrice = useCallback((priceValue: string): string => {
			if (!priceValue) return "";
			const isNegative = priceValue.trimStart().startsWith("-");
			const cleanedDigits = priceValue.replace(/\D/g, "");
			if (!cleanedDigits) return isNegative ? "-" : "";
			const formatted = formatPriceUtil(Number(cleanedDigits));
			return isNegative ? "-" + formatted : formatted;
		}, []);

		const [displayValue, setDisplayValue] = useState<string>(() => {
			if (isPriceInput) {
				return formatPrice(String(value ?? ""));
			}
			return String(value ?? "");
		});

		useEffect(() => {
			if (isPriceInput) {
				setDisplayValue(formatPrice(String(value ?? "")));
			} else {
				setDisplayValue(String(value ?? ""));
			}
		}, [value, isPriceInput, formatPrice]);

		const countDigitsBeforeCursor = useCallback(
			(text: string, cursorPos: number): number => {
				let count = 0;
				for (let i = 0; i < cursorPos; i++) {
					const char = text[i];
					if (/\d/.test(char) || /[۰-۹]/.test(char)) {
						count++;
					}
				}
				return count;
			},
			[],
		);

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const inputElement = e.target;
				const originalInputValue = inputElement.value;
				const originalCursorPos = inputElement.selectionEnd || 0;

				let valueToUpdateParent = "";
				let formattedDisplayValue = "";

				if (isPriceInput) {
					const isNegative = originalInputValue.trimStart().startsWith("-");
					const asciiValue = persianToAscii(originalInputValue);
					const cleanedDigits = asciiValue.replace(/\D/g, "");
					valueToUpdateParent = isNegative ? "-" + cleanedDigits : cleanedDigits;
					formattedDisplayValue = formatPrice(valueToUpdateParent);

					const digitsBeforeCursorInOriginal = countDigitsBeforeCursor(
						originalInputValue,
						originalCursorPos,
					);

					let newCursorPos = 0;
					let currentDigitCount = 0;

					for (let i = 0; i < formattedDisplayValue.length; i++) {
						const char = formattedDisplayValue[i];
						if (/\d/.test(char) || /[۰-۹]/.test(char)) {
							currentDigitCount++;
							if (
								currentDigitCount ===
								digitsBeforeCursorInOriginal
							) {
								newCursorPos = i + 1;
								break;
							}
						}
					}

					if (digitsBeforeCursorInOriginal === 0) {
						newCursorPos = 0;
					} else if (
						currentDigitCount <
						digitsBeforeCursorInOriginal
					) {
						newCursorPos = formattedDisplayValue.length;
					}

					setDisplayValue(formattedDisplayValue);
					setTimeout(() => {
						if (inputRef.current) {
							inputRef.current.setSelectionRange(
								newCursorPos,
								newCursorPos,
							);
						}
					}, 0);
				} else {
					valueToUpdateParent = originalInputValue;
					setDisplayValue(originalInputValue);
				}

				if (onValueChange) {
					onValueChange(valueToUpdateParent);
				}
			},
			[isPriceInput, formatPrice, countDigitsBeforeCursor, onValueChange],
		);

		const currentDirection = isRTL(displayValue) ? "rtl" : "ltr";
		const hasError = error && error.length > 0;

		return (
			<div
				className={cn(
					styles.Conter,
					containerClassName,
					"font-vazirmatn",
				)}
			>
				<div className={styles.inputWrapper}>
					<input
						ref={inputRef}
						dir={currentDirection}
						{...props}
						autoFocus={autoFocus}
						value={displayValue}
						placeholder=" "
						disabled={loading || disabled}
						className={cn(
							"font-vazirmatn",
							styles.Input,
							hasError && styles.error,
							variant === "premium" && styles.premium,
							variant === "success" && styles.success,
							loading && styles.loading,
							inputClassName,
						)}
						onChange={handleChange}
					/>

					{label && (
						<label
							className={cn(
								styles.text,
								hasError && styles.error,
								"font-vazirmatn",
							)}
						>
							{label}
						</label>
					)}

					{Icon ? (
						hasError ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<Icon
										onClick={onIconClick}
										className={cn(
											styles.icon,
											iconClassName,
											"text-red-500",
										)}
									/>
								</TooltipTrigger>
								<TooltipContent className="rtl">
									<p>{error}</p>
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
											"text-red-500",
										)}
									/>
								</TooltipTrigger>
								<TooltipContent className="rtl">
									<p>{error}</p>
								</TooltipContent>
							</Tooltip>
						)
					)}
				</div>
				{hasError && !Icon && (
					<p
						className={cn(
							styles.errorMessage,
							errorClassName,
							"font-vazirmatn",
						)}
					>
						{error}
					</p>
				)}
			</div>
		);
	},
);

const FormikBoundInput = React.forwardRef<HTMLInputElement, FormikInputProps>(
	function FormikBoundInput(
		{ name, onValueChange: customOnValueChange, ...rest },
		ref,
	) {
		const [field, meta] = useField(name);

		return (
			<RawInput
				ref={ref}
				{...rest}
				value={field.value}
				onValueChange={(val) => {
					field.onChange({
						target: {
							name: field.name,
							value: val,
						},
					});
					customOnValueChange?.(val);
				}}
				error={meta.touched ? meta.error : undefined}
			/>
		);
	},
);

const Input = React.forwardRef<HTMLInputElement, MergedInputProps>(
	function Input(props, ref) {
		const shouldUseFormik =
			"name" in props &&
			props.name &&
			(props as RawInputProps).value === undefined;

		if (shouldUseFormik) {
			try {
				return (
					<FormikBoundInput
						ref={ref}
						{...(props as FormikInputProps)}
					/>
				);
			} catch {
				// Fall back to raw mode if not in Formik context
			}
		}

		return (
			<RawInput
				ref={ref}
				{...(props as RawInputProps)}
			/>
		);
	},
);

export default Input;

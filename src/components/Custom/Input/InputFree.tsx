"use client";
import styles from "./Input.module.css";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useState, useEffect, useCallback, useRef } from "react"; // Added useRef
import { isRTL } from "@/utils/isRTL";

// --- اضافه شدن isPriceInput به Props ---
interface Props {
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
	value?: string | number | null | undefined;
	onValueChange?: (value: string) => void; // Changed value type to string for consistency
	disabled?: boolean;
	isPriceInput?: boolean; // <-- این prop جدید اضافه شد
}

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
	disabled = false,
	isPriceInput = false, // مقدار پیش‌فرض: false (یعنی حالت جستجو/متن)
	...props
}: Props) {
	const { formatPrice: formatPriceFromStore } = useSettingsStore();
	const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element

	const formatPrice = useCallback(
		(priceValue: string | number | null | undefined): string => {
			if (
				priceValue === null ||
				priceValue === undefined ||
				priceValue === ""
			)
				return "";

			// Ensure we're working with a string
			const stringValue = String(priceValue);

			// Extract only digits (Persian or ASCII) and dots for potential decimal part
			// Note: The original logic used /[^\d.]/g. If your formatPriceFromStore handles decimals, keep '.', otherwise remove it.
			// For Persian numbers, we might want to handle them more explicitly.
			// Let's assume formatPriceFromStore expects ASCII digits.
			let asciiValue = stringValue.replace(/[۰-۹]/g, (d) =>
				"۰۱۲۳۴۵۶۷۸۹".indexOf(d),
			);
			let numericString = asciiValue.replace(/[^\d.]/g, ""); // Keep dot if decimals are supported

			if (numericString === "" || numericString === ".") return "";

			const num = Number(numericString);
			if (isNaN(num)) return "";

			// formatPriceFromStore expects a number, returns a formatted string
			return formatPriceFromStore(num);
		},
		[formatPriceFromStore],
	);

	// Initialize displayValue based on the initial prop value and isPriceInput
	const initialDisplayValue = isPriceInput
		? formatPrice(value)
		: String(value || "");
	const [displayValue, setDisplayValue] =
		useState<string>(initialDisplayValue);

	// Sync local state with prop changes
	useEffect(() => {
		let formattedPropValue = "";
		if (value !== undefined && value !== null && value !== "") {
			formattedPropValue = isPriceInput
				? formatPrice(value)
				: String(value);
		}

		// Update displayValue only if it's different to avoid unnecessary re-renders/cursor resets
		if (formattedPropValue !== displayValue) {
			setDisplayValue(formattedPropValue);
		} else if (
			// Handle cases where the prop becomes empty/null/undefined
			(value === null || value === undefined || value === "") &&
			displayValue !== ""
		) {
			setDisplayValue("");
		}
	}, [value, formatPrice, displayValue, isPriceInput]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const inputElement = e.target;
			const originalValue = inputElement.value;
			// Use selectionEnd for cursor position, fallback to 0
			const originalCursorPos = inputElement.selectionEnd || 0;

			let valueToUpdateParent = originalValue;
			let newDisplayValue = originalValue;

			if (isPriceInput) {
				// 1. Extract and clean digits (Persian and ASCII)
				const persianDigits = originalValue.replace(/[^\d۰-۹]/g, "");
				const asciiDigits = originalValue.replace(/[^\d0-9]/g, "");

				let rawDigits = "";
				if (persianDigits.length > 0) {
					// Prioritize Persian digits, convert to ASCII for processing
					rawDigits = persianDigits.replace(/[۰-۹]/g, (d) =>
						"۰۱۲۳۴۵۶۷۸۹".indexOf(d),
					);
				} else {
					// Use ASCII digits if no Persian digits are found
					rawDigits = asciiDigits;
				}

				// If no digits are left after cleaning, reset
				if (rawDigits === "") {
					valueToUpdateParent = "";
					newDisplayValue = "";
				} else {
					// 2. Format the cleaned digits for display
					newDisplayValue = formatPrice(rawDigits);
					valueToUpdateParent = rawDigits; // Parent receives raw ASCII digits
				}

				// --- Improved Relative Cursor Positioning Logic ---
				// Calculate the target cursor position based on the number of digits
				// before the original cursor position.

				// Count digits in the *original* raw input *before* originalCursorPos
				let originalDigitsBeforeCursor = 0;
				for (let k = 0; k < originalCursorPos; k++) {
					const originalChar = originalValue[k];
					// Check if the character is a Persian or ASCII digit
					if (/\d/.test(originalChar) || /[۰-۹]/.test(originalChar)) {
						originalDigitsBeforeCursor++;
					}
				}

				let formattedCursorPos = 0;
				let digitsEncountered = 0;

				// Find the position *after* the `originalDigitsBeforeCursor`-th digit in the *newly formatted* string.
				for (let j = 0; j < newDisplayValue.length; j++) {
					const newChar = newDisplayValue[j];
					const isNewCharDigit =
						/\d/.test(newChar) || /[۰-۹]/.test(newChar);

					if (isNewCharDigit) {
						digitsEncountered++;
						if (digitsEncountered === originalDigitsBeforeCursor) {
							// We found the Nth digit. Place the cursor right after it.
							formattedCursorPos = j + 1;
							// Break optimization: once we find the position, no need to continue loop.
							break;
						}
					}
				}

				// Handle edge cases:
				// If originalDigitsBeforeCursor is 0 (cursor was at start or before first digit)
				if (originalDigitsBeforeCursor === 0) {
					formattedCursorPos = 0; // Place cursor at the very beginning
				}
				// If originalDigitsBeforeCursor is greater than the total number of digits found,
				// it means the cursor should be at the very end.
				else if (digitsEncountered < originalDigitsBeforeCursor) {
					formattedCursorPos = newDisplayValue.length; // Place cursor at the end
				}
				// If the loop finished without finding the exact digit count (e.g., due to formatting intricacies
				// or if originalDigitsBeforeCursor was valid but not matched exactly), default to end.
				// This 'else' covers cases where break didn't happen.
				else if (formattedCursorPos === 0) {
					// This might happen if originalDigitsBeforeCursor > 0 but digitsEncountered < originalDigitsBeforeCursor
					// Or if break condition wasn't met for some reason. Fallback to end.
					formattedCursorPos = newDisplayValue.length;
				}

				// Ensure the calculated position is within the valid bounds of the new string length
				formattedCursorPos = Math.max(
					0,
					Math.min(formattedCursorPos, newDisplayValue.length),
				);

				// Use setTimeout to apply cursor position after the DOM updates
				setTimeout(() => {
					if (inputRef.current) {
						inputRef.current.setSelectionRange(
							formattedCursorPos,
							formattedCursorPos,
						);
					}
				}, 0);
				// --- End Relative Cursor Positioning ---
			}

			// Update the display value and notify the parent
			setDisplayValue(newDisplayValue);
			if (onValueChange) {
				// Pass the raw digits (ASCII) to the parent for processing
				onValueChange(valueToUpdateParent);
			}
		},
		[
			isPriceInput,
			formatPrice,
			onValueChange,
			// Ensure displayValue is not a dependency here, as it's being set internally
		],
	);

	const currentDirection = isRTL(displayValue) ? "rtl" : "ltr";

	return (
		<div
			className={cn(styles.Conter, containerClassName, "font-vazirmatn")}
		>
			<div className={styles.inputWrapper}>
				<input
					ref={inputRef} // Attach ref to the input element
					dir={currentDirection}
					{...props} // Pass down other props like name, id, etc.
					autoFocus={autoFocus}
					value={displayValue}
					placeholder=" " // Essential for label animation
					type="text" // Keep as text for better control with mixed characters
					// Use "decimal" for mobile keyboards that support it well for prices
					inputMode={isPriceInput ? "decimal" : "text"}
					disabled={loading || disabled}
					className={cn(
						"font-vazirmatn", // Ensure font is applied
						styles.Input,
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
							errorClassName, // Use errorClassName for the label if applicable
							"font-vazirmatn",
						)}
					>
						{label}
					</label>
				)}
				{Icon && (
					<Icon
						onClick={onIconClick}
						className={cn(styles.icon, iconClassName)}
					/>
				)}
			</div>
		</div>
	);
}

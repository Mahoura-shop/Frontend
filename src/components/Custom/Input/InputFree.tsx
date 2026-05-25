"use client";
import styles from "./Input.module.css";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useState, useEffect, useCallback, useRef, useId } from "react";
import { isRTL } from "@/utils/isRTL";
import { persianToAscii } from "@/utils/translateNumber";

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
	isPriceInput?: boolean;
	autoComplete?: string;
	placeholder?: string;
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
	const inputRef = useRef<HTMLInputElement>(null);
	const midDecimalRef = useRef(false);
	const inputId = useId();

	const formatPrice = useCallback(
		(priceValue: string | number | null | undefined): string => {
			if (priceValue === null || priceValue === undefined || priceValue === "") return "";

			const stringValue = String(priceValue);
			const isNegative = stringValue.trimStart().startsWith("-");
			const asciiValue = persianToAscii(stringValue);
			const cleaned = asciiValue.replace(/[^\d.]/g, "");

			if (!cleaned) return isNegative ? "-" : "";

			const dotIndex = cleaned.indexOf(".");
			const intStr = dotIndex >= 0 ? cleaned.slice(0, dotIndex) : cleaned;
			const decPart = dotIndex >= 0 ? cleaned.slice(dotIndex) : "";

			if (!intStr && !decPart) return isNegative ? "-" : "";

			const intNum = Number(intStr || "0");
			if (isNaN(intNum)) return "";

			const formatted = formatPriceFromStore(intNum);
			return isNegative ? "-" + formatted + decPart : formatted + decPart;
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
		if (midDecimalRef.current) return;
		if (value === null || value === undefined || value === "") {
			setDisplayValue((prev) => (prev !== "" ? "" : prev));
			return;
		}
		const formatted = isPriceInput ? formatPrice(value) : String(value);
		setDisplayValue((prev) => (prev !== formatted ? formatted : prev));
	}, [value, formatPrice, isPriceInput]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const inputElement = e.target;
			const originalValue = inputElement.value;
			// Use selectionEnd for cursor position, fallback to 0
			const originalCursorPos = inputElement.selectionEnd || 0;

			let valueToUpdateParent = originalValue;
			let newDisplayValue = originalValue;

			if (isPriceInput) {
				// 1. Extract and clean digits (Persian and ASCII), preserving leading minus
				const isNeg = originalValue.trimStart().startsWith("-");
				const asciiValue = persianToAscii(originalValue);
				const rawCleaned = asciiValue.replace(/[^\d.]/g, "");
				const firstDot = rawCleaned.indexOf(".");
				let rawDigits = firstDot >= 0
					? rawCleaned.slice(0, firstDot + 1) + rawCleaned.slice(firstDot + 1).replace(/\./g, "")
					: rawCleaned;
				if (isNeg) rawDigits = "-" + rawDigits;

				// If no digits are left after cleaning, reset
				if (rawDigits === "" || rawDigits === "-") {
					valueToUpdateParent = rawDigits;
					newDisplayValue = rawDigits;
					midDecimalRef.current = false;
				} else {
					midDecimalRef.current = rawDigits.replace(/^-/, "").endsWith(".");
					newDisplayValue = formatPrice(rawDigits);
					valueToUpdateParent = rawDigits;
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

				// If original cursor was past a ".", advance past "." in formatted string too
				const hasDotBeforeCursor = originalValue.slice(0, originalCursorPos).includes(".");
				if (hasDotBeforeCursor && newDisplayValue[formattedCursorPos] === ".") {
					formattedCursorPos++;
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
					ref={inputRef}
					id={inputId}
					dir={currentDirection}
					{...props}
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
						htmlFor={inputId}
						className={cn(
							styles.text,
							errorClassName,
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

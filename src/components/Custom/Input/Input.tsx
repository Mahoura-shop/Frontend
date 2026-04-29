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
import { isRTL } from "@/utils/isRTL";
import { persianToAscii } from "@/utils/translateNumber";
import { useCallback, useRef, useState, useEffect } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
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
	// value prop is not directly used here as it's managed by Formik via field.value
	onValueChange?: (value: string) => void;
	isPriceInput?: boolean;
}

export default function Input({
	name,
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
	onValueChange,
	label,
	isPriceInput = false,
	...props
}: Props) {
	const [field, meta] = useField({ name });
	const hasError = meta.touched && meta.error;
	// const direction = isRTL(field.value) ? "rtl" : "ltr";
	const { formatPrice: formatPriceFromStore } = useSettingsStore();
	const inputRef = useRef<HTMLInputElement>(null);

	// --- Price Formatting Helper ---
	const formatPrice = useCallback(
		(priceValue: string | number | null | undefined): string => {
			if (
				priceValue === null ||
				priceValue === undefined ||
				priceValue === ""
			)
				return ""; // اگر ورودی خالی یا نامعتبر بود، خالی برگردان

			const stringValue = String(priceValue);

			// 1. استخراج اعداد خام (Persian و ASCII)
			let asciiDigits = persianToAscii(stringValue.replace(/[^\d۰-۹]/g, ""));

			if (asciiDigits === "") return ""; // اگر بعد از پاکسازی چیزی نماند، خالی برگردان

			// 2. تبدیل به عدد
			const num = Number(asciiDigits);
			if (isNaN(num)) {
				console.error(
					"Failed to convert cleaned digits to number:",
					asciiDigits,
				);
				return ""; // اگر تبدیل به عدد موفق نبود، خالی برگردان
			}

			// 3. فرمت کردن با استفاده از تابع store (که انتظار عدد دارد)
			try {
				return formatPriceFromStore(num); // تابع store را با عدد فراخوانی میکنیم
			} catch (error) {
				console.error(
					"Error formatting price with store function:",
					error,
				);
				return String(num); // در صورت خطا، عدد خام را برمیگردانیم (یا یک پیام خطا)
			}
		},
		[formatPriceFromStore],
	);

	// --- State for Display Value ---
	// Initialize displayValue based on Formik's value, applying formatting if it's a price input.
	const [displayValue, setDisplayValue] = useState<string>(() => {
		if (isPriceInput) {
			return formatPrice(field.value);
		} else {
			return String(field.value ?? "");
		}
	});

	// --- Effect to Sync Display Value with Formik's Value ---
	// This is crucial for updating the input when the value changes externally (e.g., rese
	// --- Effect to Sync Display Value with Formik's Value ---
	useEffect(() => {
		let newValue = "";
		if (isPriceInput) {
			// Use the potentially updated field.value from Formik
			newValue = formatPrice(field.value);
		} else {
			newValue = String(field.value ?? "");
		}

		// REMOVE THIS CONDITION:
		// if (newValue !== displayValue) {
		//  setDisplayValue(newValue);
		//}
		// ALWAYS update displayValue to ensure synchronization, especially after initial render or external changes
		setDisplayValue(newValue);

		// Set direction based on the Formik value
		const calculatedDirection = isRTL(String(field.value ?? ""))
			? "rtl"
			: "ltr";
		// If you have a state for direction, update it here. Otherwise, use it directly in the input.
		// setDirection(calculatedDirection); // Assuming you have 'const [direction, setDirection] = useState(...)'
	}, [field.value, isPriceInput, formatPrice]); // Remove displayValue from dependencies if you are not using the condition

	// --- Digit Counting Helper ---
	const countDigitsBeforeCursor = useCallback(
		(text: string, cursorPos: number): number => {
			let count = 0;
			for (let i = 0; i < cursorPos; i++) {
				const char = text[i];
				// Check for both Persian and ASCII digits
				if (/\d/.test(char) || /[۰-۹]/.test(char)) {
					count++;
				}
			}
			return count;
		},
		[],
	);

	// --- Main Change Handler ---
	// const handleChange = useCallback(
	// 	(e: React.ChangeEvent<HTMLInputElement>) => {
	// 		const inputElement = e.target;
	// 		const originalInputValue = inputElement.value;
	// 		const originalCursorPos = inputElement.selectionEnd || 0;

	// 		let valueToUpdateParent = ""; // Raw digits for Formik/onValueChange
	// 		let formattedDisplayValue = ""; // Formatted string for the input display

	// 		if (isPriceInput) {
	// 			// 1. Extract and clean to get raw ASCII digits
	// 			const cleanedAsciiDigits = originalInputValue
	// 				.replace(/[^\d۰-۹]/g, "")
	// 				;

	// 			valueToUpdateParent = cleanedAsciiDigits; // This is what Formik will receive
	// 			console.log("Value to Formik:", valueToUpdateParent); // <--- Add this line

	// 			// 2. Format for display
	// 			formattedDisplayValue = formatPrice(valueToUpdateParent);

	// 			// 3. Calculate new cursor position based on digits in the *original* input
	// 			const digitsBeforeCursorInOriginal = countDigitsBeforeCursor(
	// 				originalInputValue,
	// 				originalCursorPos,
	// 			);

	// 			let newCursorPos = 0;
	// 			let currentDigitCount = 0;

	// 			// Iterate through the *formatted* display value to find the correct cursor position
	// 			for (let i = 0; i < formattedDisplayValue.length; i++) {
	// 				const char = formattedDisplayValue[i];
	// 				const isDigit = /\d/.test(char) || /[۰-۹]/.test(char); // Check if it's a digit

	// 				if (isDigit) {
	// 					currentDigitCount++;
	// 					if (
	// 						currentDigitCount === digitsBeforeCursorInOriginal
	// 					) {
	// 						newCursorPos = i + 1; // Place cursor after this digit
	// 						break;
	// 					}
	// 				}
	// 			}

	// 			// Edge cases for cursor position:
	// 			if (digitsBeforeCursorInOriginal === 0) {
	// 				newCursorPos = 0; // Cursor at the beginning
	// 			} else if (currentDigitCount < digitsBeforeCursorInOriginal) {
	// 				// If we couldn't find enough digits in the formatted string, place cursor at the end
	// 				newCursorPos = formattedDisplayValue.length;
	// 			}
	// 			// Ensure cursor position is valid
	// 			newCursorPos = Math.max(
	// 				0,
	// 				Math.min(newCursorPos, formattedDisplayValue.length),
	// 			);

	// 			// Update the displayed value and schedule cursor repositioning
	// 			setDisplayValue(formattedDisplayValue);
	// 			setTimeout(() => {
	// 				if (inputRef.current) {
	// 					inputRef.current.setSelectionRange(
	// 						newCursorPos,
	// 						newCursorPos,
	// 					);
	// 				}
	// 			}, 0);
	// 		} else {
	// 			// Not a price input, pass through raw value
	// 			valueToUpdateParent = originalInputValue;
	// 			console.log(
	// 				"Value to Formik (non-price):",
	// 				valueToUpdateParent,
	// 			); // <--- Add this line
	// 			formattedDisplayValue = originalInputValue;
	// 			setDisplayValue(formattedDisplayValue);
	// 		}

	// 		// Update Formik's field value
	// 		// We create a synthetic event object to match what Formik expects
	// 		field.onChange({
	// 			target: {
	// 				name: field.name,
	// 				value: valueToUpdateParent, // Always send raw digits to Formik
	// 			},
	// 		});

	// 		// Notify parent component via onValueChange if provided
	// 		if (onValueChange) {
	// 			onValueChange(valueToUpdateParent); // Send raw digits
	// 		}
	// 	},
	// 	[
	// 		isPriceInput,
	// 		formatPrice,
	// 		countDigitsBeforeCursor,
	// 		field.name,
	// 		field.onChange,
	// 		onValueChange,
	// 	],
	// );
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const inputElement = e.target;
			const originalInputValue = inputElement.value;
			const originalCursorPos = inputElement.selectionEnd || 0;

			let valueToUpdateParent = ""; // Raw digits for Formik/onValueChange
			let formattedDisplayValue = ""; // Formatted string for the input display

			if (isPriceInput) {
				// 1. Extract and clean to get raw ASCII digits
				const cleanedAsciiDigits = persianToAscii(originalInputValue.replace(/[^\d۰-۹]/g, ""));

				valueToUpdateParent = cleanedAsciiDigits; // This is 

				// 2. Format for display using our helper, which correctly handles numbers
				formattedDisplayValue = formatPrice(valueToUpdateParent); // Pass raw digits here

				// 3. Calculate new cursor position (this part seems okay)
				const digitsBeforeCursorInOriginal = countDigitsBeforeCursor(
					originalInputValue,
					originalCursorPos,
				);
				let newCursorPos = 0;
				let currentDigitCount = 0;
				for (let i = 0; i < formattedDisplayValue.length; i++) {
					const char = formattedDisplayValue[i];
					const isDigit = /\d/.test(char) || /[۰-۹]/.test(char);
					if (isDigit) {
						currentDigitCount++;
						if (
							currentDigitCount === digitsBeforeCursorInOriginal
						) {
							newCursorPos = i + 1;
							break;
						}
					}
				}
				if (digitsBeforeCursorInOriginal === 0) {
					newCursorPos = 0;
				} else if (currentDigitCount < digitsBeforeCursorInOriginal) {
					newCursorPos = formattedDisplayValue.length;
				}
				newCursorPos = Math.max(
					0,
					Math.min(newCursorPos, formattedDisplayValue.length),
				);

				// Update the state for the input's displayed value AND schedule cursor repositioning
				setDisplayValue(formattedDisplayValue); // <-- Update state here
				setTimeout(() => {
					if (inputRef.current) {
						inputRef.current.setSelectionRange(
							newCursorPos,
							newCursorPos,
						);
					}
				}, 0);
			} else {
				// Not a price input, pass through raw value
				valueToUpdateParent = originalInputValue;
				formattedDisplayValue = originalInputValue;
				setDisplayValue(formattedDisplayValue); // <-- Update state here
			}

			// Update Formik's field value
			field.onChange({
				target: {
					name: field.name,
					value: valueToUpdateParent, // Always send raw digits to Formik
				},
			});

			// Notify parent component via onValueChange if provided
			if (onValueChange) {
				onValueChange(valueToUpdateParent); // Send raw digits
			}
		},
		[
			isPriceInput,
			formatPrice,
			countDigitsBeforeCursor,
			field.name,
			field.onChange,
			onValueChange,
			// displayValue is not needed here as we update it directly
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
					dir={currentDirection} // Use calculated direction
					{...props}
					autoFocus={autoFocus}
					value={displayValue} // <-- Use displayValue from state
					placeholder=" "
					disabled={loading || props.disabled}
					className={cn(
						"font-vazirmatn",
						styles.Input,
						props.type === "number" && styles.numberInput,
						hasError && styles.error,
						variant === "premium" && styles.premium,
						variant === "success" && styles.success,
						loading && styles.loading,
						inputClassName,
					)}
					onChange={handleChange}
					// Do NOT spread {...field} here, as we are manually controlling value and onChange
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
										"text-red-500",
									)}
								/>
							</TooltipTrigger>
							<TooltipContent className="rtl">
								<p>{meta.error}</p>
							</TooltipContent>
						</Tooltip>
					)
				)}
			</div>
			{/* Error message display can be handled here or by the Tooltip */}
			{hasError && !Icon && (
				<p
					className={cn(
						styles.errorMessage,
						errorClassName,
						"font-vazirmatn",
					)}
				>
					{meta.error}
				</p>
			)}
		</div>
	);
	// return (
	// 	<div
	// 		className={cn(styles.Conter, containerClassName, "font-vazirmatn")}
	// 	>
	// 		<div className={styles.inputWrapper}>
	// 			<input
	// 				ref={inputRef} // Attach ref
	// 				dir={direction}
	// 				// {...field} // Spread Formik field props (value, name, onChange, onBlur etc.)
	// 				{...props} // Spread other native input props
	// 				autoFocus={autoFocus}
	// 				value={displayValue} // Input's displayed value comes from our state
	// 				placeholder=" "
	// 				disabled={loading || props.disabled}
	// 				className={cn(
	// 					"font-vazirmatn",
	// 					styles.Input,
	// 					props.type === "number" && styles.numberInput, // Ensure this style exists if type is number
	// 					hasError && styles.error,
	// 					variant === "premium" && styles.premium,
	// 					variant === "success" && styles.success,
	// 					loading && styles.loading,
	// 					inputClassName,
	// 				)}
	// 				onChange={handleChange} // Use our custom handler
	// 			/>

	// 			{label && (
	// 				<label
	// 					className={cn(
	// 						styles.text,
	// 						// Apply error style to label if there's an error
	// 						hasError && styles.error,
	// 						"font-vazirmatn",
	// 					)}
	// 				>
	// 					{label}
	// 				</label>
	// 			)}

	// 			{Icon ? (
	// 				hasError ? (
	// 					<Tooltip>
	// 						<TooltipTrigger asChild>
	// 							<Icon
	// 								onClick={onIconClick}
	// 								className={cn(
	// 									styles.icon,
	// 									iconClassName,
	// 									"text-red-500",
	// 								)} // Added red for error indication
	// 							/>
	// 						</TooltipTrigger>
	// 						<TooltipContent className="rtl">
	// 							<p>{meta.error}</p>
	// 						</TooltipContent>
	// 					</Tooltip>
	// 				) : (
	// 					<Icon
	// 						onClick={onIconClick}
	// 						className={cn(styles.icon, iconClassName)}
	// 					/>
	// 				)
	// 			) : (
	// 				hasError && (
	// 					<Tooltip>
	// 						<TooltipTrigger asChild>
	// 							<AlertCircle
	// 								onClick={onIconClick}
	// 								className={cn(
	// 									styles.icon,
	// 									iconClassName,
	// 									"text-red-500",
	// 								)} // Added red for error indication
	// 							/>
	// 						</TooltipTrigger>
	// 						<TooltipContent className="rtl">
	// 							<p>{meta.error}</p>
	// 						</TooltipContent>
	// 					</Tooltip>
	// 				)
	// 			)}
	// 		</div>
	// 	</div>
	// );
}

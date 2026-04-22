"use client";

import {
	Select as ShadcnSelect,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AlertCircle, LucideIcon } from "lucide-react";
import styles from "./Select.module.css";
import { cn } from "@/lib/utils";

interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps {
	label: string;
	options: SelectOption[];
	disabled?: boolean;
	required?: boolean;
	className?: string;
	value: string;
	iconClassName?: string;
	icon?: LucideIcon;
	onIconClick?: () => void;
    onValueChange: (value: string) => void;
}

export default function SelectFree({
	label,
	options,
	disabled = false,
	required = false,
	className = "",
	value,
	iconClassName,
    onValueChange,
	icon: Icon,
	onIconClick,
}: SelectProps) {
	const hasValue = value !== "" && value;
	const direction = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(
		value || "",
	)
		? "rtl"
		: "ltr";

	const safeOptions = options?.map((opt) => ({
		...opt,
		value: opt.value === "" ? "empty_value" : opt.value,
	}));

	return (
		<div className={cn(styles.container, className)}>
			<ShadcnSelect
				disabled={disabled}
				value={value || ""}
                onValueChange={onValueChange}
				// onValueChange={(value) => {
				// 	const actualValue = value === "empty_value" ? "" : value;
				// 	helpers.setValue(actualValue);
				// }}
			>
				<SelectTrigger
					dir={direction}
					className={cn(styles.trigger, "[&>svg]:hidden")}
				>
					<SelectValue placeholder={" "} />
				</SelectTrigger>

				<SelectContent>
					<SelectGroup>
						{safeOptions?.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</ShadcnSelect>

			{/* Floating label */}
			<label className={cn(styles.label, hasValue && styles.floating)}>
				{label}
				{required && <span className="text-destructive mr-1">*</span>}
			</label>

			{/* Icon */}
			{Icon && (
				<Icon
					onClick={onIconClick}
					className={cn(styles.icon, iconClassName)}
				/>
			)}

			{/* {hasError && <div className={styles.errorText}>{meta.error}</div>} */}
		</div>
	);
}

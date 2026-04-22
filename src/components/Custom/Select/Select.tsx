"use client";

import React from "react";
import { useField } from "formik";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps {
	name: string;
	label: string;
	options: SelectOption[];
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	helper?: string;
	className?: string;
	iconClassName?: string;
	icon?: LucideIcon;
	onIconClick?: () => void;
}

export default function Select({
	name,
	label,
	options,
	placeholder,
	disabled = false,
	helper,
	required = false,
	className = "",
	iconClassName,
	icon: Icon,
	onIconClick,
}: SelectProps) {
	const [field, meta, helpers] = useField(name);

	const hasError = meta.touched && meta.error;
	const hasValue = field.value !== "" && field.value !== "0" && field.value;

	const direction = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(
		field.value || "",
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
				value={field.value || ""}
				onValueChange={(value) => {
					const actualValue = value === "empty_value" ? "" : value;
					helpers.setValue(actualValue);
				}}
				onOpenChange={(open) => {
					if (!open) helpers.setTouched(true);
				}}
			>
				<SelectTrigger
					dir={direction}
					className={cn(
						styles.trigger,
						hasError && styles.error,
						"[&>svg]:hidden",
					)}
					onBlur={() => helpers.setTouched(true)}
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
			{Icon ? (
				hasError ? (
					<Tooltip>
						<TooltipTrigger asChild>
							<Icon
								onClick={onIconClick}
								className={cn(styles.icon, iconClassName, "text-destructive")}
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
								className={cn(styles.icon, iconClassName)}
							/>
						</TooltipTrigger>
						<TooltipContent className="rtl">
							<p>{meta.error}</p>
						</TooltipContent>
					</Tooltip>
				)
			)}

			{/* {hasError && <div className={styles.errorText}>{meta.error}</div>} */}
		</div>
	);
}

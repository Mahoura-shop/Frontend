"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./ProductCombobox.module.css";

interface ProductOption {
	id: number;
	name: string;
}

interface ProductComboboxProps {
	value: number | null;
	onChange: (productID: number | null) => void;
	products: ProductOption[];
	label?: string;
	disabled?: boolean;
	className?: string;
}

export default function ProductCombobox({
	value,
	onChange,
	products,
	label = "محصول",
	disabled = false,
	className,
}: ProductComboboxProps) {
	const [open, setOpen] = React.useState(false);

	const hasValue = value !== null;
	const selectedProduct =
		value !== null ? (products.find((p) => p.id === value) ?? null) : null;

	return (
		<div className={cn(styles.container, className)}>
			<ComboboxPrimitive.Root
				items={products}
				value={selectedProduct}
				onValueChange={(product) => onChange(product?.id ?? null)}
				filter={(item, query) =>
					item.name.toLowerCase().includes(query.toLowerCase())
				}
				itemToStringLabel={(item) => item.name}
				isItemEqualToValue={(a, b) => a.id === b.id}
				open={open}
				onOpenChange={setOpen}
				disabled={disabled}
			>
				<div className={styles.inputWrapper}>
					<ComboboxPrimitive.Input
						render={<input className={styles.input} placeholder=" " />}
					/>
					<ComboboxPrimitive.Trigger className={styles.chevronButton}>
						<ChevronDownIcon className="size-4" />
					</ComboboxPrimitive.Trigger>
				</div>

				<ComboboxPrimitive.Portal>
					<ComboboxPrimitive.Positioner
						side="bottom"
						sideOffset={6}
						className="isolate z-50"
					>
						<ComboboxPrimitive.Popup className={styles.popup}>
							<div className={styles.popupLabel}>{label}</div>
							<ComboboxPrimitive.List className={styles.list}>
								<ComboboxPrimitive.Empty className={styles.empty}>
									محصولی یافت نشد
								</ComboboxPrimitive.Empty>
								<ComboboxPrimitive.Collection>
									{(product: ProductOption, index: number) => (
										<ComboboxPrimitive.Item
											key={product.id}
											value={product}
											index={index}
											className={styles.item}
										>
											{product.name}
											<ComboboxPrimitive.ItemIndicator
												render={
													<span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
														<CheckIcon className="size-3" />
													</span>
												}
											/>
										</ComboboxPrimitive.Item>
									)}
								</ComboboxPrimitive.Collection>
							</ComboboxPrimitive.List>
						</ComboboxPrimitive.Popup>
					</ComboboxPrimitive.Positioner>
				</ComboboxPrimitive.Portal>
			</ComboboxPrimitive.Root>

			<label
				className={cn(
					styles.label,
					(hasValue || open) && styles.floating,
				)}
			>
				{label}
			</label>
		</div>
	);
}

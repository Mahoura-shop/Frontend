import React from "react";
import { DialogFooter } from "@/components/ui/dialog";

export default function StickyDialogFooter({
	children,
	className,
	footerClassName,
}: Readonly<{
	children?: React.ReactNode;
	className?: string;
	footerClassName?: string;
}>) {
	return (
		<div
			className={`w-full sticky bottom-0 py-4 bg-background ${className}`}
		>
			<DialogFooter className={`w-full ${footerClassName}`}>
				{children}
			</DialogFooter>
		</div>
	);
}

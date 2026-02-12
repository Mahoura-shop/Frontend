import { Button as ShadcnButton } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import React from "react";

type ButtonProps = React.ComponentProps<typeof ShadcnButton> & {
	loading?: boolean;
};

export default function Button({
	children,
	loading = false,
	...props
}: ButtonProps) {
	return (
		<ShadcnButton {...props} disabled={props.disabled || loading}>
			{loading ? <Spinner /> : children}
		</ShadcnButton>
	);
}

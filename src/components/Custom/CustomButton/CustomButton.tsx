import { Button } from "@/components/ui/button";
import React from "react";

export default function CustomButton({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Button>{children}</Button>;
}

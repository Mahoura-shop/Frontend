import { Button as ShadcnButton } from "@/components/ui/button";
import React from "react";

export default function Button({ children }: { children: React.ReactNode }) {
	return <ShadcnButton>{children}</ShadcnButton>;
}

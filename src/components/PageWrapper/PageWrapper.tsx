"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const noGap =
		pathname === "/" ||
		pathname.startsWith("/about") ||
		pathname.startsWith("/contact") ||
		pathname.startsWith("/products") ||
		pathname.startsWith("/order");
	return (
		<div className={noGap ? undefined : "md:pt-[90px]"}>
			{children}
		</div>
	);
}

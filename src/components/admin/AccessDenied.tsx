"use client";

import { ShieldOff } from "lucide-react";

export default function AccessDenied() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
			<ShieldOff className="w-16 h-16 text-muted-foreground/50" />
			<h2 className="text-2xl font-bold">دسترسی محدود</h2>
			<p className="text-muted-foreground">
				شما مجاز به مشاهده این بخش نیستید.
			</p>
		</div>
	);
}

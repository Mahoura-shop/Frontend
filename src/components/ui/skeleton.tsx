import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("rounded-md bg-muted relative overflow-hidden", className)}
			{...props}
		>
			<div className="shimmer absolute inset-0" />
		</div>
	);
}

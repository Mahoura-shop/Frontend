import { Skeleton } from "./skeleton";

export function ProductCardSkeleton() {
	return (
		<div className="rounded-xl overflow-hidden border border-border min-h-[360px] sm:min-h-[400px]">
			<Skeleton className="h-60 w-full rounded-none" />
			<div className="p-4 flex flex-col gap-3">
				<Skeleton className="h-3 w-1/3" />
				<Skeleton className="h-5 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
				<div className="flex items-center justify-between mt-2">
					<Skeleton className="h-6 w-20 rounded-full" />
					<Skeleton className="h-6 w-16" />
				</div>
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={i} />
			))}
		</div>
	);
}

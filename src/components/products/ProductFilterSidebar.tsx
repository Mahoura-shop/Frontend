"use client";

import { Card, CardContent } from "@/components/ui/card";
import FilterPanel, { type FilterPanelProps } from "./FilterPanel";

export default function ProductFilterSidebar(props: FilterPanelProps) {
	return (
		<aside className="hidden lg:block lg:w-80 self-start sticky top-28">
			<Card>
				<CardContent className="p-6">
					<FilterPanel {...props} />
				</CardContent>
			</Card>
		</aside>
	);
}

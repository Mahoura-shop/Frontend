"use client";

import { Button } from "@/components/ui/button";

type Period = "week" | "month" | "year";

const LABELS: Record<Period, string> = {
	week: "۷ روز اخیر",
	month: "۳۰ روز اخیر",
	year: "یک سال اخیر",
};

interface Props {
	value: Period;
	onChange: (p: Period) => void;
}

export default function PeriodSelector({ value, onChange }: Props) {
	return (
		<div className="flex gap-2">
			{(["week", "month", "year"] as Period[]).map((p) => (
				<Button
					key={p}
					size="sm"
					variant={value === p ? "default" : "outline"}
					onClick={() => onChange(p)}
				>
					{LABELS[p]}
				</Button>
			))}
		</div>
	);
}

export { LABELS as PERIOD_LABELS };
export type { Period };

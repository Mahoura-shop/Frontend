const jalaliFormatter = new Intl.DateTimeFormat("fa-IR", {
	calendar: "persian",
	year: "numeric",
	month: "numeric",
	day: "numeric",
});

const jalaliLongFormatter = new Intl.DateTimeFormat("fa-IR", {
	calendar: "persian",
	year: "numeric",
	month: "long",
	day: "numeric",
});

export function formatDate(dateStr: string | Date): string {
	if (!dateStr) return "";
	try {
		return jalaliFormatter.format(new Date(dateStr));
	} catch {
		return String(dateStr);
	}
}

export function formatDateLong(dateStr: string | Date): string {
	if (!dateStr) return "";
	try {
		return jalaliLongFormatter.format(new Date(dateStr));
	} catch {
		return String(dateStr);
	}
}

export function roundPrice(price: number) {
	if (price >= 10_000_000) {
		return Math.floor(price / 100_000) * 100_000;
	}
	return Math.floor(price / 10_000) * 10_000;
}

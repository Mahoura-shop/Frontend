const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function translateNumber(number: number | string): string {
	const numberStr = number?.toString();

	return numberStr
		?.split("")
		?.map((digit) => {
			const num = parseInt(digit, 10);
			return isNaN(num) ? digit : persianDigits[num];
		})
		?.join("");
}

export function persianToAscii(str: string): string {
	return str.replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)));
}

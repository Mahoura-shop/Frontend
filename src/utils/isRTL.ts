export const isRTL = (text: string | undefined | null): boolean => {
	if (!text) return true;
	const rtlChars = /[\u0590-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
	return rtlChars.test(text);
};

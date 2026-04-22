export const translateErrorObject = (original: any) => {
	if (original) {
		const converted = Object.fromEntries(
			Object.entries(original)?.map(([key, value]) => {
				if (typeof value === "object" && value !== null) {
					// Get the first value from the nested object
					const nestedValue = Object.values(value)[0];
					return [key, nestedValue];
				}
				return [key, value];
			}),
		);
		return converted;
	}
	return null;
};

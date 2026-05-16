export default function resolvePrice(
	p: any,
	userType: string | undefined,
): number {
	switch (userType) {
		case "fellow":
			return (
				p.step1Price ||
				p.step2Price ||
				p.step3Price ||
				p.step4Price ||
				p.consumerPrice ||
				p.irrPrice ||
				0
			);
		case "shopkeeperCash":
			return (
				p.step2Price ||
				p.step3Price ||
				p.step4Price ||
				p.consumerPrice ||
				p.irrPrice ||
				0
			);
		case "shopkeeperCheque":
			return (
				p.step3Price ||
				p.step4Price ||
				p.consumerPrice ||
				p.irrPrice ||
				0
			);
		case "regular":
			return p.step4Price || p.consumerPrice || p.irrPrice || 0;
		case "admin":
			return (
				p.step1Price ||
				p.step2Price ||
				p.step3Price ||
				p.step4Price ||
				p.consumerPrice ||
				p.irrPrice ||
				0
			);
		default:
			return p.step4Price || p.consumerPrice || p.irrPrice || 0;
	}
}

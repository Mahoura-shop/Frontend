import localFont from "next/font/local";

export const Vazirmatn = localFont({
	src: [
		{
			path: "../../public/fonts/Vazirmatn-RD-FD-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../public/fonts/Vazirmatn-RD-FD-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/Vazirmatn-RD-FD-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/Vazirmatn-RD-FD-SemiBold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../../public/fonts/Vazirmatn-RD-FD-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../public/fonts/Vazirmatn-RD-FD-ExtraBold.woff2",
			weight: "800",
			style: "normal",
		},
		{
			path: "../../public/fonts/Vazirmatn-RD-FD-Black.woff2",
			weight: "900",
			style: "normal",
		},
	],
	variable: "--font-Vazirmatn",
});

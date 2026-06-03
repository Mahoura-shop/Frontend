import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s3.ir-thr-at1.arvanstorage.ir",
			},
			{
				protocol: "https",
				hostname: "mahoura-product-pic.s3.ir-thr-at1.arvanstorage.ir",
			},
			{
				protocol: "https",
				hostname: "mahoura-category-pic.s3.ir-thr-at1.arvanstorage.ir",
			},
			{
				protocol: "https",
				hostname: "mahoura-brand-pic.s3.ir-thr-at1.arvanstorage.ir",
			},
			{
				protocol: "http",
				hostname: "localhost",
			},
		],
	},
	// allowedDevOrigins: ["192.168.1.115"],
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: "/backend/:path*",
	// 			destination: `${process.env.BACKEND_URL ?? "http://127.0.0.1:8080"}/:path*`,
	// 		},
	// 	];
	// },
};

export default nextConfig;

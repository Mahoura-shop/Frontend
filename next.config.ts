import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s3.ir-thr-at1.arvanstorage.ir",
			},
			{
				protocol: "http",
				hostname: "localhost",
			},
		],
	},
};

export default nextConfig;

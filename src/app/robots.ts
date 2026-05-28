import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mahoura.com";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/admin",
					"/dashboard",
					"/cart",
					"/order",
					"/signin",
					"/payment",
				],
			},
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}

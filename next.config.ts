import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
import type { NextConfig } from "next"

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{ protocol: "https", hostname: "img.clerk.com" }],
	},
	async rewrites() {
		return [
			{
				source: "/anon-headgehog/static/:path*",
				destination: "https://us-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/anon-headgehog/:path*",
				destination: "https://us.i.posthog.com/:path*",
			},
			{
				source: "/anon-headgehog/decide",
				destination: "https://us.i.posthog.com/decide",
			},
		]
	},
	skipTrailingSlashRedirect: true,
	experimental: {
		authInterrupts: true,
	},
}

export default nextConfig

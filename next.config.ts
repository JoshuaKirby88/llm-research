import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
import type { NextConfig } from "next"

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{ protocol: "https", hostname: "img.clerk.com" }],
	},
	experimental: {
		authInterrupts: true,
	},
}

export default nextConfig

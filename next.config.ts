import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
import type { NextConfig } from "next"

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
	experimental: {
		authInterrupts: true,
		ppr: true,
	},
}

export default nextConfig

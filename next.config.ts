import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
import type { NextConfig } from "next"

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
	experimental: {
		authInterrupts: true,
	},
}

export default nextConfig

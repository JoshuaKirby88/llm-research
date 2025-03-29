import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
	clientPrefix: "NEXT_PUBLIC_",
	server: {
		DATABASE_URL: z.string(),
		CLERK_SECRET_KEY: z.string(),
		XATA_BRANCH: z.string(),
		XATA_API_KEY: z.string(),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	},
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		XATA_BRANCH: process.env.XATA_BRANCH,
		XATA_API_KEY: process.env.XATA_API_KEY,
	},
})

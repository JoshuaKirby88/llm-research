import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
	clientPrefix: "NEXT_PUBLIC_",
	server: {
		CLERK_SECRET_KEY: z.string(),
		CRYPTO_KEY: z.string(),
		OPENAI_API_KEY: z.string(),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	},
	runtimeEnvStrict: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		CRYPTO_KEY: process.env.CRYPTO_KEY,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	},
})

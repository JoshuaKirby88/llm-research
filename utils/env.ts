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
		NEXT_PUBLIC_URL: z.string(),
		NEXT_PUBLIC_POSTHOG_KEY: z.string(),
	},
	runtimeEnvStrict: {
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		CRYPTO_KEY: process.env.CRYPTO_KEY,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_URL: process.env.NODE_ENV === "production" ? "https://llmresearch.joshuakirby.webcam" : "http://localhost:3000",
		NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
	},
})

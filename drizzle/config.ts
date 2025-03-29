import { env } from "@/utils/env"
import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
	out: "drizzle/migrations",
	schema: "drizzle/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL!,
	},
})

import { defineConfig } from "drizzle-kit"
import { getLocalDB } from "./get-local-db"

export default defineConfig({
	out: "drizzle/migrations",
	schema: "drizzle/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: getLocalDB(),
	},
})

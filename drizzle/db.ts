import * as schema from "@/drizzle/schema"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { drizzle } from "drizzle-orm/d1"

const env = (await getCloudflareContext({ async: true })).env
export const db = drizzle(env.DB, { schema })

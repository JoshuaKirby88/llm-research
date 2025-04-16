import { readdirSync } from "fs"
import path from "path"

export const getLocalDB = () => {
	const basePath = path.resolve(".wrangler/state/v3/d1/miniflare-D1DatabaseObject")
	const dbFile = readdirSync(basePath).find(f => f.endsWith(".sqlite"))
	if (!dbFile) throw new Error(`.sqlite file not found in ${basePath}`)
	return path.join(basePath, dbFile)
}

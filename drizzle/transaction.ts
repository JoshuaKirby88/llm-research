import { db } from "./db"

export type TX = Parameters<Parameters<typeof db.transaction>[0]>[0]

export const transaction = async (callback: Parameters<typeof db.transaction>[0]) => {
	return await callback(db as any)
}

import { db } from "./db"

export type TX = Parameters<Parameters<typeof db.transaction>[0]>[0]

export const transaction = async <T extends Parameters<typeof db.transaction>[0]>(callback: T) => {
	return (await callback(db as any)) as ReturnType<T>
}

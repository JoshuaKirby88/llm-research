import { db } from "@/drizzle/db"
import { Contributor } from "@/drizzle/schema"
import { Research } from "@/drizzle/schema"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { count, inArray } from "drizzle-orm"
import { and, eq, or } from "drizzle-orm"
import { InsertResearchT, InsertResearchVectorT, ResearchT, ResearchVectorT, UpdateResearchT } from "../schemas"
import { TableSQLUpdate } from "../services/drizzle.service"
import { ResearchTable } from "../tables"

export class ResearchRepo {
	static getPublicWhere(input: Pick<ResearchT, "userId">) {
		return or(eq(Research.userId, input.userId), and(eq(Research.isComplete, true), eq(Research.isArchived, false)))
	}

	static async insert(input: InsertResearchT) {
		const [newResearch] = await db.insert(Research).values(input).returning()

		return newResearch
	}

	static async queryMany(ids: ResearchT["id"][]) {
		const researches = await db.query.Research.findMany({
			where: inArray(Research.id, ids),
		})

		return researches
	}

	static async update(id: ResearchT["id"], input: Omit<UpdateResearchT, "id"> | TableSQLUpdate<typeof Research>) {
		const [updatedResearch] = await db.update(Research).set(input).where(eq(Research.id, id)).returning()

		return updatedResearch
	}

	static async delete(id: ResearchT["id"]) {
		await db.delete(Research).where(eq(Research.id, id))
	}

	static async insertVector(input: InsertResearchVectorT) {
		const values = {
			id: input.id.toString(),
			values: input.values,
		}

		const env = (await getCloudflareContext({ async: true })).env
		await env.VECTORIZE.upsert([values])
	}

	static async queryVector(embedding: ResearchVectorT["values"], opt: { topK: number }) {
		const env = (await getCloudflareContext({ async: true })).env
		const result = await env.VECTORIZE.query(embedding, {
			topK: opt.topK,
			returnMetadata: "none",
		})

		return Array.from(new Set(result.matches.map(match => Number.parseInt(match.id))))
	}

	static async deleteVectors(ids: ResearchT["id"][]) {
		const env = (await getCloudflareContext({ async: true })).env
		await env.VECTORIZE.deleteByIds([ids.toString()])
	}

	static async deleteResearchAndVectorsByUserId(userId: ResearchT["userId"]) {
		const researches = await db
			.select({ id: Research.id, contributorCount: count(Contributor.id) })
			.from(Research)
			.leftJoin(Contributor, eq(Contributor.researchId, Research.id))
			.where(eq(Research.userId, userId))
			.groupBy(Research.id)

		const researchIdsToDelete = researches.filter(r => ResearchTable.canDelete(r)).map(r => r.id)
		const researchIdsToKeep = researches.filter(r => !ResearchTable.canDelete(r)).map(r => r.id)

		await db.delete(Research).where(inArray(Research.id, researchIdsToDelete))
		await db.update(Research).set({ isUserDeleted: true }).where(inArray(Research.id, researchIdsToKeep))

		await this.deleteVectors(researchIdsToDelete)
	}
}

import { db } from "@/drizzle/db"
import { Contributor } from "@/drizzle/schema"
import { Research } from "@/drizzle/schema"
import { count, inArray } from "drizzle-orm"
import { and, eq, or } from "drizzle-orm"
import { InsertResearchT, ResearchT, UpdateResearchT } from "../schemas"
import { ClerkPublicUser } from "../services/clerk.service"
import { TableMixedSQLUpdate } from "../services/drizzle.service"
import { ResearchTable } from "../tables"
import { ResearchVectorRepo } from "./research-vector.repo"

export class ResearchRepo {
	static getPublicWhere(input: { userId: ClerkPublicUser["userId"] }) {
		if (input.userId) {
			return or(eq(Research.userId, input.userId), and(eq(Research.isPublished, true), eq(Research.isArchived, false)))
		} else {
			return and(eq(Research.isPublished, true), eq(Research.isArchived, false))
		}
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

	static async update(id: ResearchT["id"], input: TableMixedSQLUpdate<Omit<UpdateResearchT, "id">>) {
		const [updatedResearch] = await db.update(Research).set(input).where(eq(Research.id, id)).returning()

		return updatedResearch
	}

	static async delete(id: ResearchT["id"]) {
		await db.delete(Research).where(eq(Research.id, id))
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

		await Promise.all([
			researchIdsToDelete.length && ResearchVectorRepo.delete(researchIdsToDelete),
			researchIdsToDelete.length && db.delete(Research).where(inArray(Research.id, researchIdsToDelete)),
			researchIdsToKeep.length && db.update(Research).set({ isUserDeleted: true }).where(inArray(Research.id, researchIdsToKeep)),
		])
	}
}

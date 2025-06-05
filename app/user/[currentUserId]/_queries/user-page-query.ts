import { db } from "@/drizzle/db"
import { Contributor, Research } from "@/drizzle/schema"
import { and, count, eq } from "drizzle-orm"

export const userPageQuery = async (input: { params: NextParam<"currentUserId"> }) => {
	const [[{ count: publishedCount }], [{ count: contributionCount }]] = await Promise.all([
		db
			.select({ count: count() })
			.from(Research)
			.where(and(eq(Research.userId, input.params.currentUserId), eq(Research.isPublished, true), eq(Research.isArchived, false))),
		db
			.select({ count: count() })
			.from(Contributor)
			.where(and(eq(Contributor.userId, input.params.currentUserId), eq(Contributor.isOwner, false))),
	])

	return {
		publishedCount,
		contributionCount,
	}
}

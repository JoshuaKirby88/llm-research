import { ResearchCard } from "@/components/cards/research-card"
import { Suspense } from "@/components/suspense"
import { db } from "@/drizzle/db"
import { Research, UserToStarredResearch } from "@/drizzle/schema"
import { DrizzleService } from "@/src/services/drizzle.service"
import { authProcedure } from "@/utils/auth-procedure"
import { destructureArray } from "@/utils/destructure-array"
import { desc, eq } from "drizzle-orm"
import { userResearchPageConfig } from "./user-research-page"

export const ResearchPage = Suspense(async (props: { tab: (typeof userResearchPageConfig)["tabs"][number]["value"] }) => {
	const user = await authProcedure("signedIn")

	const result = await db.query.Research.findMany({
		where: DrizzleService.where(Research, {
			userId: user.userId,
			isArchived: false,
			...(props.tab === "All" ? {} : props.tab === "Starred" ? { isStarred: true } : props.tab === "Archived" ? { isArchived: true } : { isComplete: props.tab === "Complete" }),
		}),
		with: {
			userToStarredResearches: {
				where: eq(UserToStarredResearch.userId, user.userId),
			},
		},
		orderBy: desc(Research.id),
	})

	const [researches, { userToStarredResearches }] = destructureArray(result, { userToStarredResearches: true })

	return researches.map(research => {
		const userToStarredResearch = userToStarredResearches.find(utsr => utsr.researchId === research.id)

		return <ResearchCard key={research.id} research={research} userToStarredResearch={userToStarredResearch} />
	})
})

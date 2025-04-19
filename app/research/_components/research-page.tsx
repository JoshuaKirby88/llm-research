import { ResearchCard } from "@/components/research-card"
import { Suspense } from "@/components/suspense"
import { db } from "@/drizzle/db"
import { Research, UserToStarredResearch } from "@/drizzle/schema"
import { authProcedure } from "@/src/services/auth-procedure/auth-procedure"
import { DrizzleService } from "@/src/services/drizzle.service"
import { eq } from "drizzle-orm"

export const ResearchPage = Suspense(async (props: { tab: "all" | "complete" | "researching" | "archived" }) => {
	const user = await authProcedure("signedIn")

	const researches = await db.query.Research.findMany({
		where: DrizzleService.where(Research, {
			userId: user.userId,
			isArchived: false,
			...(props.tab === "all" ? {} : props.tab === "archived" ? { isArchived: true } : { isComplete: props.tab === "complete" }),
		}),
		with: {
			userToStarredResearch: {
				where: eq(UserToStarredResearch.userId, user.userId),
			},
		},
	})

	return researches.map(research => <ResearchCard key={research.id} research={research} />)
})

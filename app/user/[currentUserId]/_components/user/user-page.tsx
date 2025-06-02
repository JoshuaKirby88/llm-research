import { ClerkAvatar } from "@/components/clerk/clerk-avatar"
import { Suspense } from "@/components/suspense"
import { db } from "@/drizzle/db"
import { Contributor, Research } from "@/drizzle/schema"
import { ClerkService } from "@/src/services/clerk.service"
import { and, count, eq } from "drizzle-orm"
import { CalendarIcon } from "lucide-react"

export const UserPage = Suspense(async (props: { params: NextParam<"currentUserId"> }) => {
	const [queriedUser, [{ count: publishedCount }], [{ count: contributionCount }]] = await Promise.all([
		ClerkService.queryUser(props.params.currentUserId),
		db
			.select({ count: count() })
			.from(Research)
			.where(and(eq(Research.userId, props.params.currentUserId), eq(Research.isPublished, true))),
		db
			.select({ count: count() })
			.from(Contributor)
			.where(and(eq(Contributor.userId, props.params.currentUserId), eq(Contributor.isOwner, false))),
	])

	return (
		<div className="mx-auto w-full max-w-xl space-y-10">
			<div className="flex gap-10">
				<ClerkAvatar userId={props.params.currentUserId} user={queriedUser} size="19xl" hideUserName />

				<div className="space-y-2">
					<h1 className="font-semibold text-3xl">{queriedUser.fullName}</h1>

					<p className="flex items-center gap-1 font-semibold text-muted-foreground text-sm">
						<CalendarIcon className="size-4" />
						Joined
						<span className="font-bold text-foreground">{new Date(queriedUser.createdAt).toLocaleDateString()}</span>
					</p>

					<div className="flex items-center gap-3 font-medium text-muted-foreground text-sm">
						<p>
							<span className="font-bold text-foreground">{publishedCount}</span> Published
						</p>

						<p>
							<span className="font-bold text-foreground">{contributionCount}</span> Contributed
						</p>
					</div>
				</div>
			</div>

			<p className="text-muted-foreground">{queriedUser.metadata.bio}</p>
		</div>
	)
})

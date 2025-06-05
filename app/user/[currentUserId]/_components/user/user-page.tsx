import { ClerkAvatar } from "@/components/clerk/clerk-avatar"
import { DateFeature } from "@/src/features/date.feature"
import { ClerkQueriedUser } from "@/src/schemas"
import { CalendarIcon } from "lucide-react"
import { userPageQuery } from "../../_queries/user-page-query"

export const UserPage = (props: { params: NextParam<"currentUserId">; currentUser: ClerkQueriedUser | undefined } & Return<typeof userPageQuery>) => {
	return (
		<div className="mx-auto w-full max-w-xl space-y-10">
			<div className="mx-auto flex w-fit gap-10 ">
				<ClerkAvatar userId={props.params.currentUserId} user={props.currentUser} size="19xl" hideUserName disabled />

				<div className="space-y-2">
					<h1 className="font-semibold text-3xl">{props.currentUser ? props.currentUser.fullName : "User deleted"}</h1>

					<p className="flex items-center gap-1 font-semibold text-muted-foreground text-sm">
						<CalendarIcon className="size-4" />
						Joined
						<span className="font-bold text-foreground">{props.currentUser ? DateFeature.toMonthYear(new Date(props.currentUser.createdAt)) : "---"}</span>
					</p>

					<div className="flex items-center gap-3 font-medium text-muted-foreground text-sm">
						<p>
							<span className="font-bold text-foreground">{props.publishedCount}</span> Published
						</p>

						<p>
							<span className="font-bold text-foreground">{props.contributionCount}</span> Contributed
						</p>
					</div>
				</div>
			</div>

			{props.currentUser ? <p className="text-muted-foreground">{props.currentUser.metadata.bio}</p> : null}
		</div>
	)
}

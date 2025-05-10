import { Suspense } from "@/components/suspense"
import { ClerkService } from "@/src/services/clerk.service"

export const UserPage = Suspense(async (props: { params: NextParam<"currentUserId"> }) => {
	const queriedUser = await ClerkService.queryUser(props.params.currentUserId)

	return <div>{queriedUser?.fullName}</div>
})

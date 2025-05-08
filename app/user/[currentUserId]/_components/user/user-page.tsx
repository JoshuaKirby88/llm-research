import { ClerkService } from "@/src/services/clerk.service"

export const UserPage = async (props: { params: NextParam<"currentUserId"> }) => {
	const user = await ClerkService.queryUser(props.params.currentUserId)

	return <div>{user?.fullName}</div>
}

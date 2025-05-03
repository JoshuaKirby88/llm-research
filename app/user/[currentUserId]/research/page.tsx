import { redirect } from "next/navigation"

const Page = async (props: { params: Promise<{ currentUserId: string }> }) => {
	const params = await props.params

	redirect(`/user/${params.currentUserId}?tab=Research`)
}

export default Page

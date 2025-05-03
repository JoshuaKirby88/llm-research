import { redirect } from "next/navigation"

const Page = async (props: { params: Promise<{ currentUserId: string; researchId: string }> }) => {
	const params = await props.params

	redirect(`/user/${params.currentUserId}/research/${params.researchId}?tab=Test Runs`)
}

export default Page

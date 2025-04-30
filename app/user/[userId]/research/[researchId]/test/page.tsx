import { redirect } from "next/navigation"

const Page = async (props: { params: Promise<{ userId: string; researchId: string }> }) => {
	const params = await props.params

	redirect(`/user/${params.userId}/research/${params.researchId}?tab=testRuns`)
}

export default Page

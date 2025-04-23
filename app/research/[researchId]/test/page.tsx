import { redirect } from "next/navigation"

const Page = async (props: { params: Promise<{ researchId: string }> }) => {
	const params = await props.params
	redirect(`/research/${params.researchId}?tab=testRuns`)
}

export default Page

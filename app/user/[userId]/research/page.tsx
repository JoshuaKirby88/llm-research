import { redirect } from "next/navigation"

const Page = async (props: { params: Promise<{ userId: string }> }) => {
	const params = await props.params

	redirect(`/user/${params.userId}?tab=research`)
}

export default Page

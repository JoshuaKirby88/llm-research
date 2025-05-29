import { Suspense } from "@/components/suspense"
import { redirect } from "next/navigation"

const Page = Suspense(async (props: { params: Promise<NextParam<"currentUserId" | "researchId">> }) => {
	const params = await props.params

	redirect(`/user/${params.currentUserId}/research/${params.researchId}?tab=Test Runs`)
})

export default Page

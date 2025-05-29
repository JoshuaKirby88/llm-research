import { Suspense } from "@/components/suspense"
import { redirect } from "next/navigation"

const Page = Suspense(async (props: { params: Promise<NextParam<"currentUserId">> }) => {
	const params = await props.params

	redirect(`/user/${params.currentUserId}?tab=Research`)
})

export default Page

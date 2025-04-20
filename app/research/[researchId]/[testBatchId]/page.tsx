import { authProcedure } from "@/src/services/auth-procedure/auth-procedure"

const Page = async (props: { params: Promise<{ testBatchId: string }> }) => {
	const params = await props.params
	const user = authProcedure("signedIn")

	return <div></div>
}

export default Page

import { Suspense } from "@/components/suspense"
import { Input } from "@/components/ui/input"

export const ResearchSearchForm = Suspense(async (props: { searchParams: Promise<NextSearchParam> }) => {
	const searchParams = await props.searchParams
	const { search } = searchParams

	return (
		<form className="w-full max-w-3xl space-y-4">
			<Input name="search" placeholder="Search research..." defaultValue={search} autoFocus />
		</form>
	)
}, null)

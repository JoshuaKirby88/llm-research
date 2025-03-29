import { Suspense } from "@/components/suspense"
import { Input } from "@/components/ui/input"

export const ResearchesSearchForm = Suspense(async (props: { searchParams: NextSearchParams }) => {
	const searchParams = await props.searchParams
	const { search } = searchParams

	return (
		<form className="w-full max-w-[50rem] space-y-4">
			<Input name="search" placeholder="Search public research..." defaultValue={search} autoFocus />
		</form>
	)
}, null)

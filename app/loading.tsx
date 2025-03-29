import { Spinner } from "@/components/spinner"

const Loading = () => {
	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<Spinner />
		</div>
	)
}

export default Loading

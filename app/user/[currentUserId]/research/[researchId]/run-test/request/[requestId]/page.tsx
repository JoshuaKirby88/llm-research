import { ShinyText } from "@/components/magic-ui/shiny-text"
import { Spinner } from "@/components/spinner"
import Image from "next/image"
import { DynamicRequestPolling } from "./_components/dynamic-request-polling"

const Page = (props: { params: Promise<NextParam<"currentUserId" | "researchId" | "requestId">> }) => {
	return (
		<>
			<div className="mx-auto mb-[20%] flex grow flex-col items-center justify-center gap-5">
				<Image src="/thiings/beach.webp" width={250} height={250} alt="Beach" />

				<ShinyText className="flex items-center gap-2 text-lg">
					<Spinner className="size-5" />
					Running Tests...
				</ShinyText>
			</div>

			<DynamicRequestPolling params={props.params} />
		</>
	)
}

export default Page

import { ShinyText } from "@/components/magic-ui/shiny-text"
import { Spinner } from "@/components/spinner"
import Image from "next/image"

const Page = () => {
	return (
		<div className="mx-auto flex h-full flex-col items-center justify-center gap-5">
			<Image src="/thiings/beach.webp" width={250} height={250} alt="Beach" />

			<ShinyText className="flex items-center gap-2 text-xl">
				<Spinner className="size-6" />
				Running Tests...
			</ShinyText>
		</div>
	)
}

export default Page

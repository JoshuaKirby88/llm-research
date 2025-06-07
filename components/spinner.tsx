import { cn } from "@/utils/cn"
import { LoaderIcon, LucideProps } from "lucide-react"

export const Spinner = ({ size, ...props }: LucideProps) => {
	return <LoaderIcon {...props} className={cn("size-4 animate-spin", props.className)} />
}

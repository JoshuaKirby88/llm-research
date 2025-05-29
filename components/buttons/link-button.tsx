import { cn } from "@/utils/cn"
import Link from "next/link"

export const LinkButton = ({ disabled, ...props }: { disabled?: boolean } & React.ComponentProps<typeof Link>) => {
	return <Link {...props} className={cn(disabled && "pointer-events-none opacity-50", props.className)} />
}

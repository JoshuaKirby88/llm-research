import { cn } from "@/utils/cn"
import { Badge } from "./ui/badge"

export const Shortcut = ({ children, className, variant, shortcut, ...props }: React.ComponentProps<"div"> & Pick<React.ComponentProps<typeof Badge>, "variant"> & { shortcut?: "enter" }) => {
	return (
		<div className={cn("pointer-events-none flex h-9 items-center", className)} {...props}>
			<Badge variant={variant ?? "outline"}>{shortcut === "enter" ? "↵" : children}</Badge>
		</div>
	)
}

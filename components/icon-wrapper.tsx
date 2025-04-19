import { cn } from "@/utils/cn"

export const IconWrapper = ({ children, className, ...props }: React.ComponentProps<"div">) => (
	<div className={cn("mx-auto flex h-fit w-fit items-center justify-center rounded-full border border-border p-2.5 text-muted-foreground", className)} {...props}>
		{children}
	</div>
)

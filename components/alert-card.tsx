import { cn } from "@/utils/cn"

export const AlertCard = ({ className, children, ...props }: React.ComponentProps<"div">) => (
	<div className={cn("flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-black/5 shadow-lg", className)} {...props}>
		{children}
	</div>
)

export const AlertCardContent = ({ className, title, description, children, ...props }: { title: string; description: string } & React.ComponentProps<"div">) => (
	<div className={cn("flex grow items-center justify-between gap-4", className)} {...props}>
		<div className="space-y-1">
			<p className="font-medium">{title}</p>
			<p className="text-muted-foreground text-sm">{description}</p>
		</div>

		{children}
	</div>
)

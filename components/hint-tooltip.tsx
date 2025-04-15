import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/utils/cn"
import { addClassName } from "./add-className"

export const HintTooltip = (props: { icon?: React.ReactNode; title?: string; description?: string; className?: string }) => {
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="icon" className={cn("ml-2 size-5 rounded-full text-base", props.className)}>
						?
					</Button>
				</TooltipTrigger>
				<TooltipContent className="py-3">
					<div className="flex gap-3">
						{addClassName(props.icon, cn("mt-0.5 shrink-0 text-muted-foreground"))}

						<div className="space-y-1">
							<p className="font-medium">{props.title}</p>
							<p className="text-muted-foreground text-sm">{props.description}</p>
						</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

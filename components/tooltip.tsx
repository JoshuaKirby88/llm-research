import { Tooltip as ShadTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ComponentProps } from "react"

export const Tooltip = ({ children, tooltip, ...props }: ComponentProps<typeof TooltipTrigger> & { tooltip: string }) => {
	return (
		<TooltipProvider delayDuration={0}>
			<ShadTooltip>
				<TooltipTrigger {...props}>{children}</TooltipTrigger>
				<TooltipContent className="">{tooltip}</TooltipContent>
			</ShadTooltip>
		</TooltipProvider>
	)
}

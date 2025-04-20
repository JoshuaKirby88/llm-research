import { cn } from "@/utils/cn"
import { HintTooltip } from "../hint-tooltip"
import { Label } from "../ui/label"

export const LabelWithTooltip = ({ icon, title, description, className, ...props }: React.ComponentProps<typeof Label> & React.ComponentProps<typeof HintTooltip>) => {
	return (
		<div className={cn("flex items-center gap-1", className)}>
			<Label {...props} />
			<HintTooltip icon={icon} title={title} description={description} />
		</div>
	)
}

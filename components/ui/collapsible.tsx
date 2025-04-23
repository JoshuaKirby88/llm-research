import { cn } from "@/utils/cn"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDownIcon, ChevronUpIcon, LucideProps } from "lucide-react"

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
	return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />
}

const CollapsibleChevronIcon = (props: LucideProps) => {
	return (
		<div className="relative size-6">
			<ChevronUpIcon {...props} className={cn("!size-4 absolute top-0 transition-transform group-data-[state=open]:rotate-180", props.className)} />
			<ChevronDownIcon {...props} className={cn("!size-4 absolute bottom-0 transition-transform group-data-[state=open]:rotate-180", props.className)} />
		</div>
	)
}

function CollapsibleContent({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
	return <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} />
}

export { Collapsible, CollapsibleTrigger, CollapsibleChevronIcon, CollapsibleContent }

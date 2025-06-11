import { cn } from "@/utils/cn"
import { ChevronDownIcon, ChevronUpIcon, LucideProps } from "lucide-react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} className={cn("rounded-xl", props.className)} />
}

function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
	return (
		<CollapsiblePrimitive.CollapsibleTrigger
			data-slot="collapsible-trigger"
			{...props}
			className={cn("group flex w-full items-center justify-between rounded-xl bg-muted p-4", "disabled:opacity-50", props.className)}
		/>
	)
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

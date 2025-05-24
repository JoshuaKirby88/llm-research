import { cn } from "@/utils/cn"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

function HoverCard({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
	return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ children, className, asChild, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
	const Comp = asChild ? Slot : "div"

	return (
		<HoverCardPrimitive.Trigger data-slot="hover-card-trigger" asChild {...props}>
			<Comp className={className}>{children}</Comp>
		</HoverCardPrimitive.Trigger>
	)
}

function HoverCardContent({
	className,
	align = "center",
	sideOffset = 4,
	showArrow = false,
	...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & {
	showArrow?: boolean
}) {
	return (
		<HoverCardPrimitive.Content
			data-slot="hover-card-content"
			align={align}
			sideOffset={sideOffset}
			className={cn(
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 rounded-2xl border bg-popover p-4 text-popover-foreground shadow-lg outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in",
				className,
			)}
			{...props}
		>
			{props.children}
			{showArrow && <HoverCardPrimitive.Arrow className="-my-px fill-popover drop-shadow-[0_1px_0_var(--border)]" />}
		</HoverCardPrimitive.Content>
	)
}

export { HoverCard, HoverCardContent, HoverCardTrigger }

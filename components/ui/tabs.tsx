import { cn } from "@/utils/cn"
import { Tabs as TabsPrimitive } from "radix-ui"
import * as React from "react"

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			data-orientation={props.orientation}
			className={cn("flex flex-col gap-2", "data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-row", className)}
			{...props}
		/>
	)
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				"inline-flex h-fit w-fit items-center justify-center rounded-md bg-muted p-0.5 text-muted-foreground/70",
				"data-[orientation=vertical]:flex-col data-[orientation=vertical]:p-1",
				className,
			)}
			{...props}
		/>
	)
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm outline-none transition-all hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs [&_svg]:shrink-0",
				"data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start",
				className,
			)}
			{...props}
		/>
	)
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }

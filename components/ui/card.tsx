import { cn } from "@/utils/cn"
import { VariantProps, cva } from "class-variance-authority"
import * as React from "react"

export const cardVariants = cva("flex flex-col gap-6 rounded-3xl border bg-card text-card-foreground", {
	variants: {
		padding: {
			sm: "p-4",
			default: "p-6",
		},
	},
	defaultVariants: {
		padding: "default",
	},
})

function Card({ className, padding, ...props }: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
	return <div data-slot="card" className={cn(cardVariants({ padding }), className)} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className)}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="card-title" className={cn("font-semibold leading-none", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="card-content" className={cn(className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="card-footer" className={cn("flex items-center [.border-t]:pt-6", className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }

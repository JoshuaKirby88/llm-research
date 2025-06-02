import { cn } from "@/utils/cn"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"
import { Spinner } from "../spinner"

export const buttonVariantClasses = {
	default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
	destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
	outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
	secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
	ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
	link: "text-primary underline-offset-4 hover:underline",
	text: "text-muted-foreground hover:text-foreground data-[state=open]:text-foreground",
	red: "bg-red-600 hover:bg-red-600/70 data-[state=open]:bg-red-600/70 text-white",
	green: "bg-green-600 hover:bg-green-600/70 data-[state=open]:bg-green-600/70 text-white",
	blue: "bg-blue-600 hover:bg-blue-600/70 data-[state=open]:bg-blue-600/70 text-white",
	yellow: "bg-yellow-600 hover:bg-yellow-600/70 data-[state=open]:bg-yellow-600/70 text-white",
	matte: "bg-secondary text-foreground/60 hover:bg-foreground/70 data-[state=open]:bg-foreground/70 hover:text-background data-[state=open]:text-background",
	matteRed: "bg-secondary text-foreground/60 hover:bg-red-600 data-[state=open]:bg-red-600 hover:text-white data-[state=open]:text-white",
	inverseRed: "text-red-600 hover:text-white data-[state=open]:text-white hover:bg-red-600 data-[state=open]:bg-red-600",
	inverseGreen: "text-green-600 hover:text-white data-[state=open]:text-white hover:bg-green-600 data-[state=open]:bg-green-600",
	inverseBlue: "text-blue-600 hover:text-white data-[state=open]:text-white hover:bg-blue-600 data-[state=open]:bg-blue-600",
}

export const buttonVariants = cva(
	cn(
		"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all disabled:pointer-events-none disabled:opacity-50",
		"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
		"[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	),
	{
		variants: {
			variant: buttonVariantClasses,
			size: {
				xs: "h-7 rounded-md px-2 gap-1",
				sm: "h-8 rounded-md gap-1.5 px-3",
				md: "h-9 px-4 py-2",
				lg: "h-10 rounded-md px-6 font-semibold",
				iconSm: "size-8 rounded-full",
				icon: "size-9 rounded-full",
				squareSm: "size-8",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
)

export type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
		isLoading?: boolean
	}

function Button({ className, variant, size, asChild, isLoading, children, disabled, ...props }: ButtonProps) {
	const Comp = asChild ? Slot : "button"

	return (
		<Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} disabled={disabled || isLoading} {...props}>
			<>
				{children}
				{isLoading && <Spinner className="absolute" />}
			</>
		</Comp>
	)
}

export { Button }

import { cn } from "@/utils/cn"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"

const badgeVariants = cva("inline-flex items-center border transition-colors focus:outline-none", {
	variants: {
		variant: {
			default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
			secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
			destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
			outline: "text-foreground",
		},
		size: {
			roundXs: "rounded-full justify-center font-normal size-[1.1rem] text-xs",
			roundSm: "rounded-full justify-center font-semibold text-sm size-6 shrink-0",
			xs: "rounded-sm justify-center font-normal h-[1.1rem] px-1 text-xs",
			sm: "text-sm px-2 rounded-md font-semibold",
			default: "rounded-md px-2 py-0.5 font-semibold text-sm",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }

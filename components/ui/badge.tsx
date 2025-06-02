import { cn } from "@/utils/cn"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"

export const badgeVariants = cva("inline-flex items-center border transition-colors focus:outline-none", {
	variants: {
		variant: {
			default: cn("border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80"),
			secondary: cn("border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"),
			destructive: cn("border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80"),
			outline: cn("text-foreground"),
			secondaryOutline: cn("bg-secondary text-foreground hover:bg-secondary/80"),
		},
		size: {
			roundXs: cn("h-[1.1rem] min-w-[1.1rem] justify-center rounded-full px-1 text-xs"),
			roundSm: cn("h-6 min-w-6 justify-center rounded-full px-1.5 text-sm"),
			xs: cn("h-[1.1rem] justify-center rounded-sm px-1 font-normal text-xs"),
			sm: cn("rounded-md px-2 font-semibold text-sm"),
			default: cn("rounded-md px-2 py-0.5 font-semibold text-sm"),
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

export { Badge }

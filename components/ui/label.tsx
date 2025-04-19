import { cn } from "@/utils/cn"
import * as LabelPrimitive from "@radix-ui/react-label"
import { VariantProps, cva } from "class-variance-authority"
import * as React from "react"

export const labelVariants = cva(
	"flex select-none items-center gap-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
	{
		variants: {
			size: {
				sm: "text-sm font-medium",
				md: "font-semibold",
				lg: "text-lg font-semibold",
				xl: "text-xl font-semibold",
				"2xl": "text-2xl font-semibold",
				"3xl": "text-3xl font-semibold",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
)

function Label({ className, size, ...props }: React.ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>) {
	return <LabelPrimitive.Root data-slot="label" className={cn(labelVariants({ size }), className)} {...props} />
}

export { Label }

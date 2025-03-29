import { cn } from "@/utils/cn"
import { type VariantProps, cva } from "class-variance-authority"
import { Loader } from "lucide-react"

const spinnerVariants = cva("animate-spin", {
	variants: {
		size: {
			2: "w-2 h-2",
			4: "w-4 h-4",
			5: "w-5 h-5",
			6: "w-6 h-6",
		},
	},
	defaultVariants: {
		size: 4,
	},
})

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {}

export const Spinner = ({ size, className }: SpinnerProps & { className?: string }) => {
	return <Loader className={cn(spinnerVariants({ size }), className)} />
}

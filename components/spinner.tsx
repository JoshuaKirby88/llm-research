import { cn } from "@/utils/cn"
import { type VariantProps, cva } from "class-variance-authority"
import { LoaderIcon, LucideProps } from "lucide-react"

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

export const Spinner = ({ size, ...props }: VariantProps<typeof spinnerVariants> & LucideProps) => {
	return <LoaderIcon {...props} className={cn(spinnerVariants({ size }), props.className)} />
}

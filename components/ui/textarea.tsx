import { cn } from "@/utils/cn"
import { cva } from "class-variance-authority"
import * as React from "react"

export const textareaVariants = cva(
	"field-sizing-content flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
)

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return <textarea data-slot="textarea" className={cn(textareaVariants(), className)} {...props} />
}

export { Textarea }

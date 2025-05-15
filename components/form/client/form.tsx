import { cn } from "@/utils/cn"
import { FormProvider, UseFormReturn } from "react-hook-form"

export const Form = ({ onSubmit, children, className, ...props }: { onSubmit: (...args: any[]) => any; className?: string; children: React.ReactNode } & UseFormReturn<any, any, any>) => (
	<FormProvider {...props}>
		<form
			className={cn("space-y-2", className)}
			onSubmit={e => {
				props.handleSubmit(onSubmit)(e)
				e.stopPropagation()
			}}
		>
			{children}
		</form>
	</FormProvider>
)

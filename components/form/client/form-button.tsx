import { cn } from "@/utils/cn"
import { useFormContext } from "react-hook-form"
import { Button, ButtonProps } from "../../ui/button"

export const FormButton = ({ className, children, ...props }: ButtonProps) => {
	const { formState } = useFormContext()

	return (
		<Button type="submit" className={cn("mt-1 w-full", className)} disabled={!formState.isValid} isLoading={formState.isSubmitting} {...props}>
			{children}
		</Button>
	)
}

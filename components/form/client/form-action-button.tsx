import { ButtonProps } from "@/components/ui/button"
import { Form } from "react-hook-form"
import { FormButton } from "../server/form-button"

export const FormActionButton = ({ action, ...props }: { action: (...args: any) => any } & ButtonProps) => {
	return (
		<Form
			onSubmit={input => {
				action()
				input.event?.stopPropagation()
			}}
		>
			<FormButton {...props} />
		</Form>
	)
}

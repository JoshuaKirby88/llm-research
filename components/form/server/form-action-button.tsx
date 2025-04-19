import { ButtonProps } from "../../ui/button"
import { FormButton } from "./form-button"

export const FormActionButton = ({ action, ...props }: { action: (...args: any[]) => any } & ButtonProps) => (
	<form action={action}>
		<FormButton {...props} />
	</form>
)

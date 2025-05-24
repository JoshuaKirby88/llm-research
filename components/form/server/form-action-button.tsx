import { FormButton } from "./form-button"

export const FormActionButton = ({ action, ...props }: { action: (...args: any[]) => any } & React.ComponentProps<typeof FormButton>) => (
	<form action={action}>
		<FormButton {...props} />
	</form>
)

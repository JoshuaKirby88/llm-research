import { Button, ButtonProps } from "./ui/button"

export const FormActionButton = ({ action, ...props }: { action: (...args: any[]) => any } & ButtonProps) => (
	<form action={action}>
		<Button type="submit" {...props} />
	</form>
)

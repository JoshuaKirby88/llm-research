import { FormButton } from "./form-button"

export const FormRouteHandler = ({ action, input, ...props }: { action: string; input?: Record<string, any>; children?: React.ReactNode } & React.ComponentProps<typeof FormButton>) => {
	const encoded = input ? encodeURIComponent(JSON.stringify(input)) : null

	return (
		<form method="POST" action={action}>
			{encoded && <input type="hidden" name="payload" value={encoded} />}

			<FormButton {...props} />
		</form>
	)
}

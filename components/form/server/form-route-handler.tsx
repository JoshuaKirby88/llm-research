export const FormRouteHandler = (props: { action: string; input?: Record<string, any>; children?: React.ReactNode }) => {
	const encoded = props.input ? encodeURIComponent(JSON.stringify(props.input)) : null

	return (
		<form method="POST" action={props.action}>
			{encoded && <input type="hidden" name="payload" value={encoded} />}

			{props.children}
		</form>
	)
}

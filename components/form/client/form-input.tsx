import { Input } from "@/components/ui/input"
import { ComponentProps } from "react"
import { useFormContext } from "react-hook-form"

type Props = RequiredObj<Pick<ComponentProps<typeof Input>, "name">> & ComponentProps<typeof Input>

export const FormInput = (props: Props) => {
	const { register } = useFormContext()

	const registration = props.type === "number" ? register(props.name, { valueAsNumber: true }) : register(props.name)

	return <Input type="text" {...props} {...registration} />
}

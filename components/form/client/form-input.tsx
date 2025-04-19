import { Input } from "@/components/ui/input"
import { ComponentProps } from "react"
import { useFormContext } from "react-hook-form"

type Props = RequiredObj<Pick<ComponentProps<typeof Input>, "name">> & ComponentProps<typeof Input>

export const FormInput = ({ className, ...props }: Props) => {
	const { register } = useFormContext()

	return <Input type="text" {...props} {...register(props.name)} />
}

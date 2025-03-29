import { ComponentProps } from "react"
import { useFormContext } from "react-hook-form"
import { Textarea } from "../textarea"

export const FormTextarea = ({ name, label, ...props }: ComponentProps<typeof Textarea> & { name: string; label?: string }) => {
	const { register } = useFormContext()

	return <Textarea {...props} {...register(name)} />
}

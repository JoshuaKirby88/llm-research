"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export const FormButton = ({ as, ...props }: ButtonProps & { as?: string }) => {
	const Comp = as ?? Button
	const { pending } = useFormStatus()

	return <Comp type="submit" isLoading={pending} {...props} />
}

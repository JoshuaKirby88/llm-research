"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export const FormButton = (props: ButtonProps) => {
	const { pending } = useFormStatus()

	return <Button type="submit" isLoading={pending} {...props} />
}

"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export const FormButton = ({ isLoading, ...props }: ButtonProps & { as?: string }) => {
	const { pending } = useFormStatus()

	return <Button type="submit" isLoading={pending || isLoading} {...props} />
}

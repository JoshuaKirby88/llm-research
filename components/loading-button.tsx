"use client"
import { useState } from "react"
import { Button, ButtonProps } from "./ui/button"

export const LoadingButton = (props: ButtonProps) => {
	const [isLoading, setIsLoading] = useState(false)

	const onClick: ButtonProps["onClick"] = async event => {
		setIsLoading(true)
		await props.onClick?.(event)
		setIsLoading(false)
	}

	return <Button {...props} isLoading={props.isLoading || isLoading} onClick={onClick} />
}

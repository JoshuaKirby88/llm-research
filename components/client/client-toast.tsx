"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export const ClientToast = <T extends "success" | "info" | "error">(props: Record<T, Parameters<(typeof toast)[T]>[0]>) => {
	useEffect(() => {
		const key = Object.keys(props)[0] as T
		const value = props[key]

		toast[key](value)
	}, [props])

	return null
}

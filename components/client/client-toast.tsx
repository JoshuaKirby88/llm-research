"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export const ClientToast = <T extends "success" | "info" | "error">(props: Record<T, { title: Parameters<(typeof toast)[T]>[0]; data: Parameters<(typeof toast)[T]>[1] }>) => {
	useEffect(() => {
		const key = Object.keys(props)[0] as T
		const value = props[key]

		toast[key](value.title, value.data)
	}, [props])

	return null
}

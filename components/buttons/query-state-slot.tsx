"use client"

import { Slot } from "@radix-ui/react-slot"
import { useSearchParams } from "next/navigation"

export const QueryStateSlot = (props: { name: string; value: string } & React.ComponentProps<typeof Slot>) => {
	const searchParams = useSearchParams()

	const onClick = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.set(props.name, props.value)
		window.history.replaceState(null, "", `?${params.toString()}`)
	}

	return <Slot {...props} onClick={onClick} />
}

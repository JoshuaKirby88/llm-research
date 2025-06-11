"use client"

import { useSearchParams } from "next/navigation"
import { Slot } from "radix-ui"

export const QueryStateSlot = (props: { name: string; value: string } & React.ComponentProps<typeof Slot.Root>) => {
	const searchParams = useSearchParams()

	const onClick = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.set(props.name, props.value)
		window.history.replaceState(null, "", `?${params.toString()}`)
	}

	return <Slot.Root {...props} onClick={onClick} />
}

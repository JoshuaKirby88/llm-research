"use client"

import { ComponentProps, ReactNode, useState } from "react"
import { Switch } from "./switch"

export const SwitchWithLabels = ({ start, end, ...props }: ComponentProps<typeof Switch> & { start: ReactNode; end: ReactNode }) => {
	const [checked, setChecked] = useState(!!props.checked)

	const onCheckedChange = (checked: boolean) => {
		props.onCheckedChange?.(checked)
		setChecked(checked)
	}

	return (
		<div className="group flex items-center gap-2" data-state={checked ? "checked" : "unchecked"}>
			<span className="cursor-pointer text-sm group-data-[state=checked]:opacity-40" onClick={() => onCheckedChange(false)}>
				{start}
			</span>
			<Switch {...props} onCheckedChange={onCheckedChange} />
			<span className="cursor-pointer text-sm group-data-[state=unchecked]:opacity-40" onClick={() => onCheckedChange(true)}>
				{end}
			</span>
		</div>
	)
}

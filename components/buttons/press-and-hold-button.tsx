"use client"

import { cn } from "@/utils/cn"
import { useRef, useState } from "react"
import { Button, ButtonProps } from "../ui/button"

const DURATION = 2000

export const PressAndHoldButton = ({ children, icon, className, onClick, ...props }: { icon?: React.ReactNode; onClick: () => {} } & ButtonProps) => {
	const [isHolding, setIsHolding] = useState(false)
	const timerRef = useRef<NodeJS.Timeout>(null)

	const onHold = () => {
		setIsHolding(true)

		timerRef.current = setTimeout(() => {
			setIsHolding(false)
			onClick()
		}, DURATION)
	}

	const onRelease = () => {
		setIsHolding(false)

		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}
	}

	return (
		<Button
			className={cn("relative select-none overflow-hidden", isHolding && "scale-[0.97]", className)}
			onMouseDown={onHold}
			onTouchStart={onHold}
			onMouseUp={onRelease}
			onMouseLeave={onRelease}
			onTouchEnd={onRelease}
			{...props}
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 flex items-center justify-center gap-2 bg-black/30 dark:bg-white/30"
				style={{
					clipPath: isHolding ? "inset(0px 0px 0px 0px)" : "inset(0px 100% 0px 0px)",
					transition: isHolding ? `clip-path ${DURATION}ms linear` : "clip-path 500ms ease-out",
				}}
			>
				{children}
			</div>

			{children}
		</Button>
	)
}

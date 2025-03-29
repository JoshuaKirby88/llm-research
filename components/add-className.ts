import { cn } from "@/utils/cn"
import React from "react"

export const addClassName = (children: React.ReactNode, className: string) =>
	React.Children.map(children, child => React.cloneElement(child as React.ReactElement<{ className: string }>, { className: cn((child as any).props?.className, className) }))

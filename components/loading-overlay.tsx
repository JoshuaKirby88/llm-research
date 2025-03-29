import { cn } from "@/utils/cn"
import React from "react"
import { Spinner } from "./spinner"

export const LoadingOverlay = (props: { isLoading?: boolean; children: React.ReactNode }) => (
	<>
		{React.Children.map(props.children, child =>
			React.isValidElement<{ className?: string }>(child) && child.type !== React.Fragment ? (
				React.cloneElement(child, {
					className: cn(child.props.className, props.isLoading && "opacity-30"),
				})
			) : child ? (
				<span className={cn(props.isLoading && "opacity-30")}>{child}</span>
			) : null,
		)}

		{props.isLoading && <Spinner className="absolute" />}
	</>
)

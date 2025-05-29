import { cn } from "@/utils/cn"
import * as React from "react"
import { addClassName } from "../utils/add-className"

type EmptyStateProps = {
	title: string
	description: string
	icons?: React.ReactNode[]
	images?: string[]
	button: React.ReactNode
	className?: string
}

export const EmptyState = (props: EmptyStateProps) => (
	<div className={cn("group w-full rounded-xl border-2 border-border border-dashed bg-background p-7 text-center", props.className)}>
		<div className="isolate flex justify-center">
			{props.icons?.length === 3 ? (
				props.icons.map((icon, i) => {
					const className = cn(
						"group-hover:-translate-y-0.5 relative grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200",
						["-rotate-6 group-hover:-translate-x-5 group-hover:-rotate-12 top-1.5 left-2.5", "z-10", "top-1.5 right-2.5 rotate-6 group-hover:translate-x-5 group-hover:rotate-12"][i],
					)
					return (
						<div key={i} className={className}>
							{addClassName(icon, "w-6 h-6 text-muted-foreground")}
						</div>
					)
				})
			) : (
				<div className="group-hover:-translate-y-0.5 grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200">
					{props.icons?.[0] && addClassName(props.icons[0], "w-6 h-6 text-muted-foreground")}
				</div>
			)}
		</div>

		<h2 className="mt-6 font-medium text-foreground">{props.title}</h2>

		<p className="mt-1 mb-4 whitespace-pre-line text-muted-foreground text-sm">{props.description}</p>

		{props.button}
	</div>
)

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "./ui/badge"

export const VariableBadge = (props: { variable: { name: string }; values: { value: string; color?: string }[] }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge variant="secondary">
						{props.variable.name}
						<Badge className="ml-1" size="roundXs" variant="outline">
							{props.values.length}
						</Badge>
					</Badge>
				</TooltipTrigger>

				<TooltipContent>
					<ul className="space-y-1 pl-3">
						{props.values.map((value, i) => (
							<li key={i} className="list-disc font-medium text-sm" style={{ color: value.color }}>
								{value.value}
							</li>
						))}
					</ul>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DependentValueT, ResearchT, TestBatchResultT } from "@/src/schemas"
import { cn } from "@/utils/cn"
import { createContext, useContext } from "react"
import { LabelList, Pie, PieChart } from "recharts"

const context = createContext<Props | null>(null)

type Props = {
	research: ResearchT
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

export const ResearchChartCard = ({ research, dependentValues, testBatchResults, ...props }: Props & React.ComponentProps<typeof Card>) => {
	return (
		<context.Provider value={{ research, dependentValues, testBatchResults }}>
			<Card size="sm" {...props} className={cn("relative", props.className)} />
		</context.Provider>
	)
}

export const ResearchChart = (props: React.ComponentProps<typeof CardContent>) => {
	const { dependentValues, testBatchResults } = useContext(context)!

	const chartData = dependentValues.map(dependentValue => {
		const totalCount = testBatchResults.filter(tbr => tbr.dependentValueId === dependentValue.id).reduce((acc, curr) => acc + curr.count, 0)
		return { result: dependentValue.value, count: totalCount, fill: `var(--color-${dependentValue.value})` }
	})

	const chartConfig = dependentValues.reduce<ChartConfig>(
		(acc, curr, i) => ({
			...acc,
			[curr.value]: { label: curr.value, color: curr.color },
		}),
		{ count: { label: "Count" } },
	)

	return (
		<CardContent {...props} className={cn("", props.className)}>
			<ChartContainer config={chartConfig} className="aspect-square [&_.recharts-text]:fill-background">
				<PieChart>
					<ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
					<Pie data={chartData} dataKey="count" animationDuration={500} animationEasing="ease" animationBegin={0}>
						<LabelList dataKey="result" className="fill-background" stroke="none" fontSize={12} formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label} />
					</Pie>
				</PieChart>
			</ChartContainer>
		</CardContent>
	)
}

const ResearchChartHeader = () => {
	return (
		<CardHeader className="items-center pb-0">
			<CardTitle>Research Results</CardTitle>
		</CardHeader>
	)
}

export const ResearchChartFooter = () => {
	const { research } = useContext(context)!

	return (
		<CardFooter className="flex p-4 pt-0">
			<p className={cn("font-medium text-muted-foreground text-sm")}>{research.conclusion}</p>
		</CardFooter>
	)
}

export const ResearchChartNoResultOverlay = (props: { className?: string }) => {
	const { testBatchResults } = useContext(context)!

	return (
		!testBatchResults.length && (
			<div className={cn("absolute inset-0 flex items-center justify-center bg-background/90 p-2", props.className)}>
				<Card size="xs" className="shadow">
					Run tests to view results.
				</Card>
			</div>
		)
	)
}

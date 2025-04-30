"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DependentValueT, TestBatchResultT } from "@/src/schemas"
import { cn } from "@/utils/cn"
import { TrendingUp } from "lucide-react"
import { createContext, useContext } from "react"
import { LabelList, Pie, PieChart } from "recharts"

const context = createContext<Props | null>(null)

type Props = {
	dependentValues: DependentValueT[]
	testBatchResults: TestBatchResultT[]
}

export const ResearchChartCard = ({ dependentValues, testBatchResults, ...props }: Props & React.ComponentProps<typeof Card>) => {
	return (
		<context.Provider value={{ dependentValues, testBatchResults }}>
			<Card padding="sm" {...props} className={cn("relative gap-1 overflow-clip", props.className)}>
				{props.children}

				{!testBatchResults.length && <ResearchChartNoResultOverlay />}
			</Card>
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
			[curr.value]: { label: curr.value, color: `var(--chart-${i + 1})` },
		}),
		{ count: { label: "Count" } },
	)

	return (
		<CardContent {...props} className={cn("aspect-square pb-0", props.className)}>
			<ChartContainer config={chartConfig} className="-m-2 aspect-square [&_.recharts-text]:fill-background">
				<PieChart>
					<ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
					<Pie data={chartData} dataKey="count" className="" animationDuration={500} animationEasing="ease" animationBegin={0}>
						<LabelList dataKey="result" className="fill-background" stroke="none" fontSize={12} formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label} />
					</Pie>
				</PieChart>
			</ChartContainer>
		</CardContent>
	)
}

export const ResearchChartHeader = () => {
	return (
		<CardHeader className="items-center pb-0">
			<CardTitle>Research Results</CardTitle>
		</CardHeader>
	)
}

export const ResearchChartFooter = () => {
	return (
		<CardFooter className="flex-col gap-2 text-sm">
			<div className="flex items-center gap-2 font-medium leading-none">
				Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
			</div>
			<div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
		</CardFooter>
	)
}

const ResearchChartNoResultOverlay = () => {
	return (
		<div className="absolute inset-0 flex items-center justify-center bg-background/90">
			<Card padding="xs" className="shadow">
				Run tests to view results.
			</Card>
		</div>
	)
}

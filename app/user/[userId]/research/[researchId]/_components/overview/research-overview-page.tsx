import { ContributorT, DependentValueT, ResearchT, TestBatchResultT } from "@/src/schemas"
import { cn } from "@/utils/cn"
import { User } from "@clerk/nextjs/server"
import omit from "lodash.omit"
import { CalendarIcon, CheckCircle2Icon, LucideIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { ResearchChart, ResearchChartCard, ResearchChartFooter, ResearchChartHeader, ResearchChartNoResultOverlay } from "./research-chart"

export const ResearchOverviewPage = (props: { researchUser: User; research: ResearchT; contributors: ContributorT[]; dependentValues: DependentValueT[]; testBatchResults: TestBatchResultT[] }) => {
	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-semibold text-3xl">{props.research.name}</h1>

			<div className="flex gap-4">
				<ResearchChartCard dependentValues={props.dependentValues} testBatchResults={props.testBatchResults}>
					<ResearchChartHeader />
					<ResearchChart />
					<ResearchChartFooter />
					<ResearchChartNoResultOverlay />
				</ResearchChartCard>

				<div className="flex flex-col gap-2">
					<BulletItem icon={CalendarIcon}>{props.research.createdAt.toLocaleDateString()}</BulletItem>
					<BulletItem icon={UserIcon}>
						<Link href={`/user/${props.research.userId}`} className="text-blue-600 hover:underline">
							{props.researchUser.fullName}
						</Link>
					</BulletItem>
					<BulletItem icon={UserIcon}>{props.contributors.map(c => c.id)}</BulletItem>
					<BulletItem icon={CheckCircle2Icon}>Stats: {props.research.isComplete ? "Complete" : "Researching"}</BulletItem>
				</div>
			</div>
		</div>
	)
}

const BulletItem = (props: { icon: LucideIcon } & React.ComponentProps<"div">) => {
	return (
		<div {...omit(props, ["icon"])} className={cn("flex items-center gap-2", props.className)}>
			<props.icon />
			{props.children}
		</div>
	)
}

import { ContributorT, ResearchT } from "@/src/schemas"
import { cn } from "@/utils/cn"
import omit from "lodash.omit"
import { CalendarIcon, LucideIcon, UserIcon } from "lucide-react"
import Link from "next/link"

export const ResearchOverviewPage = (props: { research: ResearchT; contributors: ContributorT[] }) => {
	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-semibold text-3xl">{props.research.name}</h1>

			<div className="flex gap-4">
				<div className="size-[20rem] border">
					[Result in large text]
					<br /> Some pie chart...?
					<br /> If is not complete, user can click button here to write conclusion and complete it.
				</div>

				<div className="flex flex-col gap-2">
					<BulletItem icon={CalendarIcon}>{props.research.createdAt.toLocaleDateString()}</BulletItem>
					<BulletItem icon={UserIcon}>
						<Link href={`/user/${props.research.userId}`} className="text-blue-600 hover:underline">
							{props.research.userId}
						</Link>
					</BulletItem>
					<BulletItem icon={UserIcon}>{props.contributors.map(c => c.id)}</BulletItem>
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

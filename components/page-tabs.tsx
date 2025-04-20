import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/utils/cn"
import { LucideIcon } from "lucide-react"
import { QueryStateSlot } from "./query-state-slot"

type Tab = { key: string; title: string; icon: LucideIcon }

export const PageTabs = ({ tabs, searchParams, ...props }: { tabs: readonly Tab[]; searchParams: Awaited<NextSearchParams> } & React.ComponentProps<typeof Tabs>) => {
	const defaultTab = tabs.map(tab => tab.key).includes(searchParams.tab!) ? searchParams.tab : tabs[0].key

	return <Tabs defaultValue={defaultTab} {...props} />
}

export const PageTabsList = ({ tabs, ...props }: { tabs: readonly Tab[] } & React.ComponentProps<typeof TabsList>) => {
	return (
		<TabsList {...props} className={cn("mb-10", props.className)}>
			{tabs.map(tab => (
				<QueryStateSlot key={tab.key} name="tab" value={tab.key}>
					<TabsTrigger value={tab.key} className="gap-2">
						<tab.icon className="text-muted-foreground" />
						{tab.title}
					</TabsTrigger>
				</QueryStateSlot>
			))}
		</TabsList>
	)
}

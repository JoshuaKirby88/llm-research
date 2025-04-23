import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/utils/cn"
import { LucideIcon } from "lucide-react"
import { QueryStateSlot } from "./query-state-slot"

type Tab = { key: string; title: string; icon?: LucideIcon; iconNode?: React.ReactNode }

export const PageTabs = ({ tabs, name, searchParams, ...props }: { tabs: readonly Tab[]; name?: string; searchParams: Awaited<NextSearchParams> } & React.ComponentProps<typeof Tabs>) => {
	const defaultTab = tabs.map(tab => tab.key).includes(searchParams.tab!) ? searchParams.tab : tabs[0].key

	return <Tabs defaultValue={defaultTab} {...props} />
}

export const PageTabsList = ({ tabs, name, ...props }: { tabs: readonly Tab[]; name?: string } & React.ComponentProps<typeof TabsList>) => {
	return (
		<TabsList {...props} className={cn("mb-10 data-[orientation=vertical]:mr-5 data-[orientation=vertical]:mb-0", props.className)}>
			{tabs.map(tab => (
				<QueryStateSlot key={tab.key} name={name ?? "tab"} value={tab.key}>
					<TabsTrigger value={tab.key} className={cn("gap-2")}>
						{tab.icon && <tab.icon className="text-muted-foreground" />}
						{tab.iconNode}
						{tab.title}
					</TabsTrigger>
				</QueryStateSlot>
			))}
		</TabsList>
	)
}

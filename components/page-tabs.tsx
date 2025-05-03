import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/utils/cn"
import { LucideIcon } from "lucide-react"
import { QueryStateSlot } from "./query-state-slot"

type Tab = { key?: string; value: string; icon?: LucideIcon; iconNode?: React.ReactNode }

export const PageTabs = ({ tabs, name, searchParams, ...props }: { tabs: readonly Tab[]; name?: string; searchParams: Awaited<NextSearchParam> } & React.ComponentProps<typeof Tabs>) => {
	const searchParamKey = name ?? "tab"
	const searchParamValue = Array.isArray(searchParams[searchParamKey]) ? searchParams[searchParamKey].join(" ") : searchParams[searchParamKey]
	const defaultTab = tabs.map(tab => tab.key ?? tab.value).includes(searchParamValue!) ? searchParamValue : (tabs[0].key ?? tabs[0].value)

	return <Tabs defaultValue={defaultTab} {...props} />
}

export const PageTabsList = ({ tabs, name, ...props }: { tabs: readonly Tab[]; name?: string } & React.ComponentProps<typeof TabsList>) => {
	return (
		<TabsList {...props} className={cn("mb-10 data-[orientation=vertical]:mr-5 data-[orientation=vertical]:mb-0", props.className)}>
			{tabs.map(tab => {
				const tabId = tab.key ?? tab.value

				return (
					<QueryStateSlot key={tabId} name={name ?? "tab"} value={tabId}>
						<TabsTrigger value={tabId} className="gap-2">
							{tab.icon && <tab.icon className="text-muted-foreground" />}
							{tab.iconNode}
							{tab.value}
						</TabsTrigger>
					</QueryStateSlot>
				)
			})}
		</TabsList>
	)
}

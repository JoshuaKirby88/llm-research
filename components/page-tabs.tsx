import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/utils/cn"
import { LucideIcon } from "lucide-react"
import { ComponentProps, ReactNode } from "react"
import { QueryStateSlot } from "./buttons/query-state-slot"
import { Badge } from "./ui/badge"

type Tab = { key?: string; value: string; icon?: LucideIcon; iconNode?: ReactNode; badge?: ReactNode }

const config = {
	defaultTabName: "tab",
}

export const PageTabs = ({ tabs, name, searchParams, ...props }: { tabs: readonly Tab[]; name?: string; searchParams: Awaited<NextSearchParam> } & ComponentProps<typeof Tabs>) => {
	const searchParamKey = name ?? config.defaultTabName
	const searchParamValue = Array.isArray(searchParams[searchParamKey]) ? searchParams[searchParamKey].join(" ") : searchParams[searchParamKey]
	const defaultTab = tabs.map(tab => tab.key ?? tab.value).includes(searchParamValue!) ? searchParamValue : tabs.length ? (tabs[0].key ?? tabs[0].value) : undefined

	return <Tabs defaultValue={defaultTab} {...props} />
}

export const PageTabsList = ({ tabs, name, ...props }: { tabs: readonly Tab[]; name?: string } & ComponentProps<typeof TabsList>) => {
	return (
		<TabsList {...props} className={cn("mb-10 data-[orientation=vertical]:mr-5 data-[orientation=vertical]:mb-0", props.className)}>
			{tabs.map(tab => {
				const tabId = tab.key ?? tab.value

				return (
					<QueryStateSlot key={tabId} name={name ?? config.defaultTabName} value={tabId}>
						<TabsTrigger value={tabId} className="gap-2">
							{tab.icon && <tab.icon className="text-muted-foreground" />}
							{tab.iconNode}
							{tab.value}
							{tab.badge != undefined && (
								<Badge size="roundXs" className="font-semibold">
									{tab.badge}
								</Badge>
							)}
						</TabsTrigger>
					</QueryStateSlot>
				)
			})}
		</TabsList>
	)
}

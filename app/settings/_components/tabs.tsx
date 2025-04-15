import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CircleUserRoundIcon, KeyIcon } from "lucide-react"

const config = {
	tabs: [
		{ key: "account", title: "Account", icon: CircleUserRoundIcon },
		{ key: "apiKey", title: "API Key", icon: KeyIcon },
	],
} as const

export const SettingsTabs = ({ children, ...props }: React.ComponentProps<typeof Tabs>) => {
	return (
		<Tabs defaultValue={config.tabs[0].key} {...props}>
			<TabsList className="mb-10">
				{config.tabs.map(tab => (
					<TabsTrigger key={tab.key} value={tab.key} className="gap-2">
						<tab.icon className="text-muted-foreground" aria-hidden="true" />
						{tab.title}
					</TabsTrigger>
				))}
			</TabsList>

			{children}
		</Tabs>
	)
}

export const SettingsTabsContent = (props: { value: (typeof config.tabs)[number]["key"] } & React.ComponentProps<typeof TabsContent>) => {
	return <TabsContent {...props} />
}

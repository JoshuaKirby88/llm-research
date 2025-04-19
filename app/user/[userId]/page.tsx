import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlaskConicalIcon, GiftIcon } from "lucide-react"

const config = {
	tabs: [
		{ key: "research", title: "Research", icon: FlaskConicalIcon },
		{ key: "contributions", title: "Contributions", icon: GiftIcon },
	],
} as const

const Page = async (props: { params: Promise<{ userId: string }> }) => {
	const params = await props.params

	return (
		<div className="w-full max-w-5xl">
			<Tabs defaultValue={config.tabs[0].key}>
				<TabsList className="mb-10">
					{config.tabs.map(tab => (
						<TabsTrigger key={tab.key} value={tab.key} className="gap-2">
							<tab.icon className="text-muted-foreground" />
							{tab.title}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
		</div>
	)
}

export default Page

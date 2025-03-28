import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { db } from "@/drizzle/db"

const researchData = [
	{ id: 1, title: "Research on Prompt Engineering", description: "Analysis of prompt variables." },
	{ id: 2, title: "LLM Behaviour Study", description: "Exploring response trends from LLMs." },
	{ id: 3, title: "User Prompt Analysis", description: "Understanding how users craft prompts." },
]

const Page = async () => {
	const researches = await db.query.Research.findMany()

	return (
		<div className="container mx-auto space-y-10 pt-40">
			<h1 className="text-center font-bold text-6xl">LLM Research</h1>

			<div className="mx-auto max-w-[50rem]">
				<Input placeholder="Search public research..." />
			</div>

			<div className="mx-auto grid max-w-[70rem] grid-cols-1 gap-4 md:grid-cols-3">
				{researchData.map(research => (
					<Card key={research.id} className="p-4">
						<h2 className="mb-2 font-semibold text-2xl">{research.title}</h2>
						<p>{research.description}</p>
					</Card>
				))}
			</div>
		</div>
	)
}

export default Page

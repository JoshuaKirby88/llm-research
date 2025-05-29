import { getCloudflareContext } from "@opennextjs/cloudflare"
import { InsertResearchVectorT, ResearchT, ResearchVectorT } from "../schemas"

export class ResearchVectorRepo {
	private static index: VectorizeIndex

	private static async getIndex() {
		if (!this.index) {
			const env = (await getCloudflareContext({ async: true })).env
			const index = env[process.env.NODE_ENV === "production" ? "VECTORIZE_PROD" : "VECTORIZE_DEV"]
			this.index = index
		}

		return this.index
	}

	static async insert(input: InsertResearchVectorT) {
		const index = await this.getIndex()

		const values = {
			id: input.id.toString(),
			values: input.values,
		}

		await index.upsert([values])
	}

	static async query(embedding: ResearchVectorT["values"], opt: { topK: number; minScore: number }) {
		const index = await this.getIndex()

		const result = await index.query(embedding, {
			topK: opt.topK,
			returnMetadata: "none",
		})

		const filteredMatches = result.matches.filter(match => match.score >= opt.minScore)

		return Array.from(new Set(filteredMatches.map(match => Number.parseInt(match.id))))
	}

	static async delete(ids: ResearchT["id"][]) {
		const index = await this.getIndex()

		await index.deleteByIds([ids.toString()])
	}
}

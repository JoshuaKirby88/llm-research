import { ResearchT } from "../schemas"

export class ResearchTable {
	static vectorizedWhere = { isComplete: true, isArchived: false }

	static canDelete(input: { contributorCount: number }) {
		// Only contributor is the owner of the research
		return input.contributorCount === 1
	}

	static createEmbeddingText(input: Pick<ResearchT, "name" | "description" | "conclusion">) {
		const parts = [input.name, input.description, input.conclusion].filter(text => text?.trim())
		return parts.join("\n")
	}

	static canVectorize(research: ResearchT) {
		return research.isComplete && !research.isArchived
	}

	static canDeleteVector(research: ResearchT) {
		return research.isComplete
	}
}

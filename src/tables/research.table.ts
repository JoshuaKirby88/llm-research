import { ClerkPublicUser, ResearchT } from "../schemas"

export class ResearchTable {
	static isPublic(input: { research: ResearchT; user: ClerkPublicUser | null }) {
		if (input.user?.userId) {
			return input.research.userId === input.user.userId || (input.research.isPublished && !input.research.isArchived)
		} else {
			return input.research.isPublished && !input.research.isArchived
		}
	}

	static canDelete(input: { contributorCount: number }) {
		// Only contributor is the owner of the research
		return input.contributorCount === 1
	}

	static createEmbeddingText(input: Pick<ResearchT, "name" | "description" | "conclusion">) {
		const parts = [input.name, input.description, input.conclusion].filter(text => text?.trim())
		return parts.join("\n\n")
	}

	static canVectorize(research: ResearchT) {
		return research.isPublished && !research.isArchived
	}

	static canDeleteVector(research: ResearchT) {
		return research.isPublished && research.isArchived
	}
}

import { AIFeature, AIProvider } from "../features"

export class ActionError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options)
		this.name = "ActionError"
	}
}

export class APIKeyError extends ActionError {
	constructor(option: AIProvider | "noAPIKey") {
		if (option === "noAPIKey") {
			super("Please set an API key.")
		} else {
			super(`Invalid API key for ${AIFeature.providerMap[option].title}.`)
		}
	}
}

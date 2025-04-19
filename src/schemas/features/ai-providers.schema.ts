export type AIProvider = (typeof aiProviders)[number]
export const aiProviders = ["openai", "google", "anthropic"] as const

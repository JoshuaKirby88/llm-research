import { z } from "zod"

export type AIServiceSchemaKey = keyof typeof aiServiceSchemas
export type AIServiceSchema = { [K in AIServiceSchemaKey]: ReturnType<(typeof aiServiceSchemas)[K]> }
export type AIServiceSchemasI = { [K in AIServiceSchemaKey]: Parameters<(typeof aiServiceSchemas)[K]>[0] }

export const aiServiceSchemas = {
	generateMessage: () => ({
		json: { key: "generateMessage" as const, arg: undefined },
		schema: z.object({ answer: z.string().describe("Just the generated text.") }),
	}),
	evaluate: (dependentValues: string[]) => ({
		json: { key: "evaluate" as const, arg: dependentValues },
		schema: z.object({ evaluation: z.enum(dependentValues as [string, ...string[]]) }),
	}),
}

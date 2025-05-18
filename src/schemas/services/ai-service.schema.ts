import { z } from "zod"

export type AIServiceSchemaKey = keyof typeof AIServiceSchemas
export type AIServiceSchema = { [K in AIServiceSchemaKey]: ReturnType<(typeof AIServiceSchemas)[K]> }
export type AIServiceSchemasI = { [K in AIServiceSchemaKey]: Parameters<(typeof AIServiceSchemas)[K]>[0] }

export const AIServiceSchemasOld = {
	generateMessage: () => z.object({ answer: z.string().describe("Just the generated text.") }),
	evaluate: (dependentValues: string[]) => z.object({ evaluation: z.enum(dependentValues as [string, ...string[]]) }),
}

export const AIServiceSchemas = {
	generateMessage: () => ({
		json: { key: "generateMessage" as const, arg: undefined },
		schema: z.object({ answer: z.string().describe("Just the generated text.") }),
	}),
	evaluate: (dependentValues: string[]) => ({
		json: { key: "evaluate" as const, arg: dependentValues },
		schema: z.object({ evaluation: z.enum(dependentValues as [string, ...string[]]) }),
	}),
}

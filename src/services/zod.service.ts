import { JsonSchema, jsonSchemaToZod } from "json-schema-to-zod"
import { ZodSchema, z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

const preserveZ = z

export class ZodService {
	static zodToJsonSchema(zodSchema: ZodSchema) {
		return zodToJsonSchema(zodSchema) as JsonSchema
	}

	static jsonSchemaToZod(jsonSchema: JsonSchema) {
		const code = jsonSchemaToZod(jsonSchema)
		return new Function("z", `return (${code})`)(z) as ZodSchema
	}
}

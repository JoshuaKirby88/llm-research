import { ZodTypeAny, z } from "zod"

export const stripZodMinMax = <T extends ZodTypeAny>(schema: T): T => {
	if (schema instanceof z.ZodString) {
		return z.string() as any as T
	}

	if (schema instanceof z.ZodArray) {
		return z.array(stripZodMinMax(schema._def.type)) as any as T
	}

	if (schema instanceof z.ZodObject) {
		const shape = schema._def.shape()
		const newShape: Record<string, ZodTypeAny> = {}
		for (const key in shape) {
			newShape[key] = stripZodMinMax(shape[key])
		}
		return z.object(newShape) as any as T
	}

	if (schema instanceof z.ZodOptional) {
		return z.optional(stripZodMinMax(schema._def.innerType)) as any as T
	}
	if (schema instanceof z.ZodNullable) {
		return z.nullable(stripZodMinMax(schema._def.innerType)) as any as T
	}
	if (schema instanceof z.ZodDefault) {
		return stripZodMinMax(schema._def.innerType).default(schema._def.defaultValue()) as T
	}
	if (schema instanceof z.ZodEffects) {
		return stripZodMinMax(schema._def.schema) as T
	}

	return schema as T
}

import { AIFeature, AIModelArr } from "@/src/features"
import { z } from "zod"
import { researchSchema } from "../db/research.schema"

export const runTestISchema = z.object({
	userId: z.string(),
	researchId: researchSchema.shape.id,
	models: z
		.enum(AIFeature.models as AIModelArr)
		.array()
		.min(1),
	iterations: z.number().min(1),
})

export type RunTestI = z.infer<typeof runTestISchema>

export const runTestFormSchema = runTestISchema.pick({ models: true, iterations: true })

export type RunTestFormS = z.infer<typeof runTestFormSchema>

import { AIFeature, AIModelArr } from "@/src/features"
import { z } from "zod"
import { researchSchema } from "../db/research.schema"

export const runTestSchema = z.object({ userId: z.string(), researchId: researchSchema.shape.id, models: z.enum(AIFeature.models as AIModelArr).array(), iterations: z.number() })

export type RunTest = z.infer<typeof runTestSchema>

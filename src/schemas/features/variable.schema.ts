import { z } from "zod"

export const variableSchema = z.enum(["independent", "blocking", "dependent"])

export type Variable = z.infer<typeof variableSchema>

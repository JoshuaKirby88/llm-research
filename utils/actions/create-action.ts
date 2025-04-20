import { ActionError } from "@/src/entities/errors"
import { AuthProcedure, AuthProcedureO, AuthProcedureService } from "@/src/services"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import type { z } from "zod"

export type ActionO<T extends (...input: any[]) => Promise<any | { error: string }>> = Exclude<Awaited<ReturnType<T>>, { error: string }>
export type ActionI<T extends (...input: any[]) => Promise<any>> = Parameters<T>[0]

type OptionalAuthProcedureO<T extends AuthProcedure | "none"> = T extends AuthProcedure ? AuthProcedureO<T> : null

export const createAction = <A extends AuthProcedure | "none", Z extends z.ZodType>(procedure: A, schema?: Z) => {
	return <Input extends Z extends z.ZodType ? z.infer<Z> : undefined, Output>(serverAction: (allInput: { user: OptionalAuthProcedureO<A>; input: Input }) => Promise<Output>) => {
		return async (...args: Input extends undefined ? [] : [Input]) => {
			let user: OptionalAuthProcedureO<A> = null as OptionalAuthProcedureO<A>
			let data: Input = args[0] as Input

			try {
				if (schema) {
					const parseResult = schema.safeParse(data)
					if (!parseResult.success) {
						console.error(parseResult.error)
						console.error(new Error(`Action input parse error.\nInput: ${JSON.stringify(data)}.\nUser: ${JSON.stringify(user)}.\nAuth procedure: ${procedure}`))
						throw new ActionError("Invalid input")
					}
					data = parseResult.data
				}

				if (procedure !== "none") {
					user = (await AuthProcedureService[procedure as AuthProcedure]()) as OptionalAuthProcedureO<A>
				}

				return await serverAction({ user: user, input: data })
			} catch (error) {
				if (isRedirectError(error)) {
					throw error
				}

				if (error instanceof ActionError) {
					return { error: error.message }
				}

				console.error(error)
				console.error(new Error(`Action error.\nInput: ${JSON.stringify(data)}.\nUser: ${JSON.stringify(user)}.\nAuth procedure: ${procedure}`))

				throw error
			}
		}
	}
}

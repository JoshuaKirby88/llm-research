import { ActionError } from "@/src/entities/errors"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { unauthorized } from "next/navigation"
import { cache } from "react"
import { AuthProcedure, AuthProcedureO, AuthProcedureService } from "./auth-procedure.service"

export const authProcedure = cache(async <T extends AuthProcedure>(procedure: T) => {
	try {
		return (await AuthProcedureService[procedure]()) as AuthProcedureO<T>
	} catch (error) {
		if (isRedirectError(error)) {
			throw error
		}

		if (error instanceof ActionError) {
			unauthorized()
		}

		throw error
	}
})

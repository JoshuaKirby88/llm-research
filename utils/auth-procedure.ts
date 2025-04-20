import { ActionError } from "@/src/entities/errors"
import { AuthProcedure, AuthProcedureO, AuthProcedureService } from "@/src/services/auth-procedure.service"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { unauthorized } from "next/navigation"
import { cache } from "react"

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

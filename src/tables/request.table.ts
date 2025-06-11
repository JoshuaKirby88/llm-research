import { ErrorRequestT, RequestT, SuccessRequestT } from "../schemas"

export class RequestTable {
	static handleRequest<A, B, C>(request: RequestT | undefined, callbacks: { onSuccess: (request: SuccessRequestT) => A; onError: (request: ErrorRequestT) => B; onNoRequest: () => C }) {
		if (request && !request.isLoading && request.successId !== null) {
			return callbacks.onSuccess({ ...request, isLoading: false, successId: request.successId })
		} else if (request && !request.isLoading && request.error !== null) {
			return callbacks.onError({ ...request, isLoading: false, error: request.error })
		} else if (!request) {
			return callbacks.onNoRequest()
		}
	}
}

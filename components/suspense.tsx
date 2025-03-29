import Loading from "@/app/loading"
import { Suspense as ReactSuspense } from "react"

export const Suspense = <Input extends object, Output>(AsyncComponent: (input: Input) => Output, fallback?: React.ReactNode) => {
	const TAsyncComponent = AsyncComponent as any as React.FC

	const SuspenseComponent = (input: Input) => {
		return (
			<ReactSuspense fallback={fallback !== undefined ? fallback : <Loading />}>
				<TAsyncComponent {...input} />
			</ReactSuspense>
		)
	}

	return SuspenseComponent
}

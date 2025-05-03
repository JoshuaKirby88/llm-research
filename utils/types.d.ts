type RequiredObj<T> = Required<{
	[P in keyof T]: NonNullable<T[P]>
}>

type PickRequired<T, K extends keyof T> = T & RequiredObj<Pick<T, K>>

type NextSearchParam = { [key: string]: string | undefined }

type InternalNextParam = { currentUserId: string; researchId: string; testBatchId: string; researchIds: string[] | undefined }
type NextParam<T extends keyof InternalNextParam> = Pretty<Pick<InternalNextParam, T>>

type Pretty<T> = {
	[K in keyof T]: T[K]
} & {}

type Return<T extends (...args: any[]) => any> = NonNullable<Awaited<ReturnType<T>>>

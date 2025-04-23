type RequiredObj<T> = Required<{
	[P in keyof T]: NonNullable<T[P]>
}>

type PickRequired<T, K extends keyof T> = T & RequiredObj<Pick<T, K>>

type NextSearchParams = Promise<{ [key: string]: string | undefined }>

type Pretty<T> = {
	[K in keyof T]: T[K]
} & {}

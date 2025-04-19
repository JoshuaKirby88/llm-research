type RequiredObj<T> = Required<{
	[P in keyof T]: NonNullable<T[P]>
}>

type PickRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

type NextSearchParams = Promise<{ [key: string]: string | undefined }>

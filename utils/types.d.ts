type RequiredObj<T> = Required<{
	[P in keyof T]: NonNullable<T[P]>
}>

type NextSearchParams = Promise<{ [key: string]: string | string[] | undefined }>

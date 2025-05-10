type Elem<U> = U extends (infer I)[] ? I : NonNullable<U>

export type NestedSpec<T> = {
	[K in keyof T]?: true | NestedSpec<Elem<T[K]>>
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type Extracted<T, S extends NestedSpec<T>> = UnionToIntersection<
	{
		[K in Extract<keyof S, keyof T>]: S[K] extends true
			? { [P in K & string]: Elem<T[K]>[] }
			: S[K] extends NestedSpec<Elem<T[K]>>
				? {
						[P in K & string]: Pretty<Omit<Elem<T[K]>, Extract<keyof S[K], string>>>[]
					} & Extracted<Elem<T[K]>, S[K]>
				: {}
	}[Extract<keyof S, keyof T>]
>

export function destructureArray<T extends Record<string, any>, S extends NestedSpec<T>>(array: T[], spec: S): [Array<Pretty<Omit<T, Extract<keyof S, string>>>>, Extracted<T, S>] {
	const getPaths = (obj: any, prefix: string[] = []): string[][] => {
		const paths: string[][] = []
		for (const key of Object.keys(obj)) {
			const val = obj[key]
			const cur = [...prefix, key]
			paths.push(cur)
			if (val && typeof val === "object" && val !== true) {
				paths.push(...getPaths(val, cur))
			}
		}
		return paths
	}
	const paths = getPaths(spec)

	const extracted: Record<string, any[]> = {}
	for (const p of paths) {
		extracted[p[p.length - 1]] = []
	}

	const collect = (obj: any, path: string[]) => {
		if (obj == null) return
		const [head, ...rest] = path
		const v = obj[head]
		if (v === undefined) return

		if (rest.length === 0) {
			const parentSpec = spec[head] as any
			if (Array.isArray(v)) {
				if (parentSpec && parentSpec !== true) {
					const childKeys = Object.keys(parentSpec)
					for (const x of v) {
						const copy = { ...x }
						for (const k of childKeys) {
							delete (copy as any)[k]
						}
						extracted[head].push(copy)
					}
				} else {
					extracted[head].push(...v)
				}
			} else {
				if (parentSpec && parentSpec !== true) {
					const childKeys = Object.keys(parentSpec)
					const copy = { ...v }
					for (const k of childKeys) {
						delete (copy as any)[k]
					}
					extracted[head].push(copy)
				} else {
					extracted[head].push(v)
				}
			}
		} else {
			if (Array.isArray(v)) {
				for (const x of v) collect(x, rest)
			} else {
				collect(v, rest)
			}
		}
	}

	const rest: Array<Omit<T, Extract<keyof S, string>>> = []
	for (const item of array) {
		const copy = { ...item }
		for (const k of Object.keys(spec)) {
			delete (copy as any)[k]
		}
		rest.push(copy as any)

		for (const p of paths) {
			collect(item, p)
		}
	}

	return [rest, extracted as Extracted<T, S>]
}

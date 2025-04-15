"use client"

import { ClerkProvider as BaseClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export const ClerkProvider = (props: { children: React.ReactNode }) => {
	const { resolvedTheme } = useTheme()
	const theme = resolvedTheme === "dark" ? dark : undefined

	return <BaseClerkProvider appearance={{ baseTheme: theme }}>{props.children}</BaseClerkProvider>
}

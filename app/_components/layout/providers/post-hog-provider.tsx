"use client"

import { Suspense } from "@/components/suspense"
import { env } from "@/utils/env"
import { useAuth } from "@clerk/nextjs"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { usePostHog } from "posthog-js/react"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { ReactNode, useEffect } from "react"

export const PostHogProvider = (props: { children: ReactNode }) => {
	useEffect(() => {
		posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
			api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
			person_profiles: "identified_only",
			capture_pageview: false,
			capture_pageleave: true,
			disable_session_recording: process.env.NODE_ENV !== "production",
		})
	}, [])

	return (
		<PHProvider client={posthog}>
			<PostHogPageView />
			<PostHogUserIdentifier />

			{props.children}
		</PHProvider>
	)
}

const PostHogPageView = Suspense(() => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const posthog = usePostHog()

	useEffect(() => {
		if (pathname && posthog) {
			let url = window.origin + pathname
			if (searchParams.toString()) {
				url = url + "?" + searchParams.toString()
			}

			posthog.capture("$pageview", { $current_url: url })
		}
	}, [pathname, searchParams, posthog])

	return null
}, null)

const PostHogUserIdentifier = Suspense(() => {
	const user = useAuth()
	const postHog = usePostHog()

	useEffect(() => {
		if (user.userId) {
			postHog.identify(user.userId)
		}
	}, [postHog, user.userId])

	return null
}, null)

"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export const startResearchAction = async () => {
	const { userId, redirectToSignIn } = await auth()

	if (userId) {
		redirect("/research")
	} else {
		redirectToSignIn({ returnBackUrl: "/research" })
	}
}

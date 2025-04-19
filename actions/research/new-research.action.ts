"use server"

import { createAction } from "@/utils/actions/create-action"
import { redirect } from "next/navigation"

export const newResearchAction = createAction("public")(async ({ user }) => {
	if (user.userId) {
		redirect("/new")
	} else {
		user.redirectToSignIn({ returnBackUrl: "/new" })
	}
})

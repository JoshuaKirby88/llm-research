"use client"

import { redirect } from "next/navigation"

export const ClientRedirect = (props: { redirectUrl: string }) => {
	redirect(props.redirectUrl)
}

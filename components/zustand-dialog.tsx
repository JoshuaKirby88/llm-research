"use client"

import { ZustandDialogActions, ZustandDialogStates, useDialogZustand } from "@/src/zustand/dialog-zustand"
import { Dialog } from "./dialog"

export const ZustandDialog = (props: ZustandDialogStates & ZustandDialogActions & { isZustand?: boolean }) => {
	const state = useDialogZustand(state => (props.isZustand ? state : props))

	return <Dialog {...state} />
}

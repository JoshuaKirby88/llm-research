import { ButtonProps } from "@/components/ui/button"
import { ReactNode, useEffect } from "react"
import { create } from "zustand"

type States = {
	defaultOpen?: boolean
	isOpen?: boolean
	icon?: ReactNode
	title?: ReactNode
	description?: ReactNode
	confirmProps?: ButtonProps
	confirmCloseProps?: ButtonProps
	cancelProps?: ButtonProps
	confirmButton?: ReactNode
	confirmCloseButton?: ReactNode
	cancelButton?: ReactNode
	xButton?: boolean
	children?: ReactNode
	triggerButton?: ReactNode
}

export type ZustandDialogStates = States

type Actions = {
	setIsOpen?: (open: boolean) => void
}

export type ZustandDialogActions = Actions

type InternalActions = {
	open: (states: States) => void
	setConfirmIsLoading: (isLoading: boolean) => void
}

const initialStates: States = {
	defaultOpen: undefined,
	isOpen: undefined,
	icon: undefined,
	title: undefined,
	description: undefined,
	confirmProps: undefined,
	confirmCloseProps: undefined,
	cancelProps: undefined,
	confirmButton: undefined,
	confirmCloseButton: undefined,
	cancelButton: undefined,
	xButton: undefined,
	children: undefined,
	triggerButton: undefined,
}

export const useDialogZustand = create<States & Actions & InternalActions>(set => ({
	setIsOpen: (open: boolean) => set({ isOpen: open }),
	open: states =>
		set({
			...initialStates,
			isOpen: true,
			...states,
		}),
	setConfirmIsLoading: isLoading =>
		set(state => ({
			...state,
			confirmProps: state.confirmProps ? { ...state.confirmProps, isLoading } : undefined,
			confirmCloseProps: state.confirmCloseProps ? { ...state.confirmCloseProps, isLoading } : undefined,
		})),
}))

export const useSetZustandDialogConfirmIsLoading = (isLoading: boolean) => {
	useEffect(() => {
		useDialogZustand.getState().setConfirmIsLoading(isLoading)
	}, [isLoading])
}

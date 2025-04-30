import { DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogXButton, Dialog as ShadDialog, DialogFooter as ShadDialogFooter } from "@/components/ui/dialog"
import { ZustandDialogActions, ZustandDialogStates } from "@/src/zustand/dialog-zustand"
import { cn } from "@/utils/cn"
import pick from "lodash.pick"
import { IconWrapper } from "./icon-wrapper"
import { Button } from "./ui/button"
import { DialogHeader } from "./ui/dialog"

export const Dialog = (props: ZustandDialogStates & ZustandDialogActions) => {
	return (
		<ShadDialog {...(props.isOpen !== undefined ? { open: props.isOpen, onOpenChange: props.setIsOpen } : { defaultOpen: props.defaultOpen })}>
			{props.triggerButton && <DialogTrigger asChild>{props.triggerButton}</DialogTrigger>}

			<DialogContent {...props.contentProps} className={cn("space-y-5", props.contentProps?.className)}>
				{props.xButton && <DialogXButton />}

				<DialogHeader className="text-left">
					{props.icon && <IconWrapper className="mb-2">{props.icon}</IconWrapper>}

					<DialogTitle>{props.title}</DialogTitle>

					{props.description && <DialogDescription className="whitespace-pre-wrap">{props.description}</DialogDescription>}
				</DialogHeader>

				{props.children}

				<DialogFooter {...pick(props, ["confirmProps", "cancelProps", "confirmButton", "cancelButton", "confirmCloseButton", "confirmCloseProps"])} />
			</DialogContent>
		</ShadDialog>
	)
}

export const DialogFooter = (props: Pick<ZustandDialogStates, "confirmProps" | "cancelProps" | "confirmButton" | "cancelButton" | "confirmCloseButton" | "confirmCloseProps">) => {
	return (
		(props.confirmProps ?? props.cancelProps ?? props.confirmButton ?? props.cancelButton) && (
			<ShadDialogFooter className="grid grid-cols-2">
				{props.cancelButton ? (
					props.cancelButton
				) : props.cancelProps ? (
					<DialogClose asChild>
						<Button variant="outline" {...props.cancelProps} className={props.cancelProps?.className} />
					</DialogClose>
				) : null}

				{props.confirmButton ? (
					props.confirmButton
				) : props.confirmCloseButton ? (
					<DialogClose asChild>{props.confirmCloseButton}</DialogClose>
				) : props.confirmProps ? (
					<Button {...props.confirmProps} className={props.confirmProps.className} />
				) : props.confirmCloseProps ? (
					<DialogClose asChild>
						<Button {...props.confirmCloseProps} />
					</DialogClose>
				) : null}
			</ShadDialogFooter>
		)
	)
}

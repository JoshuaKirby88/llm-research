import { cn } from "@/utils/cn"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { VariantProps, cva } from "class-variance-authority"
import * as React from "react"

export type AvatarProps = VariantProps<typeof avatarVariants>

export const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
	variants: {
		size: {
			xxxs: "size-4",
			xxs: "size-5",
			xs: "size-6",
			sm: "size-7",
			md: "size-8",
			lg: "size-9",
			xl: "size-10",
		},
	},
	defaultVariants: {
		size: "md",
	},
})

function Avatar({ className, size, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root> & AvatarProps) {
	return <AvatarPrimitive.Root data-slot="avatar" className={cn(avatarVariants({ size }), className)} {...props} />
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
	return <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full", className)} {...props} />
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
	return <AvatarPrimitive.Fallback data-slot="avatar-fallback" className={cn("flex size-full items-center justify-center rounded-[inherit] bg-secondary text-xs", className)} {...props} />
}

export { Avatar, AvatarFallback, AvatarImage }

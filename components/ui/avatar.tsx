import { cn } from "@/utils/cn"
import { VariantProps, cva } from "class-variance-authority"
import Image from "next/image"
import { Avatar as AvatarPrimitive } from "radix-ui"
import * as React from "react"

export type AvatarProps = VariantProps<typeof avatarVariants>

export const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
	variants: {
		size: {
			"3xs": "size-4",
			"2xs": "size-5",
			xs: "size-6",
			sm: "size-7",
			md: "size-8",
			lg: "size-9",
			xl: "size-10",
			"2xl": "size-11",
			"3xl": "size-12",
			"19xl": "size-28",
		},
	},
	defaultVariants: {
		size: "md",
	},
})

function Avatar({ className, size, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root> & AvatarProps) {
	return <AvatarPrimitive.Root data-slot="avatar" data-size={size} className={cn(avatarVariants({ size }), className)} {...props} />
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof Image>) {
	return <Image data-slot="avatar-image" className={cn("aspect-square size-full object-cover", className)} {...props} />
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
	return <AvatarPrimitive.Fallback data-slot="avatar-fallback" className={cn("flex size-full items-center justify-center rounded-[inherit] bg-secondary text-xs", className)} {...props} />
}

export { Avatar, AvatarFallback, AvatarImage }

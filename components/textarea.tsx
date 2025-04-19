"use client"

import { cn } from "@/utils/cn"
import { ComponentProps } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { textareaVariants } from "./ui/textarea"

export const Textarea = ({ className, ...props }: ComponentProps<typeof TextareaAutosize>) => <TextareaAutosize className={cn(textareaVariants(), "resize-none", className)} {...props} />

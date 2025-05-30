"use client"

import { cn } from "@/utils/cn"
import { TagInput as EmplorTagInput, TagInputProps } from "emblor"
import { XIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { inputVariants } from "./ui/input"

type Props = Partial<Omit<TagInputProps, "tags" | "onTagAdd" | "onTagRemove" | "onClearAll">> & {
	tags: string[]
	onTagAdd: (tag: string) => void
	onTagRemove: (tag: string) => void
	onClearAll: () => void
}

export const TagInput = ({ tags, onTagAdd, onTagRemove, onClearAll, className, ...props }: Props) => {
	const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
	const emblorTags = tags.map(tag => ({ id: tag, text: tag }))

	return (
		<div className={cn("relative", className)}>
			<EmplorTagInput
				tags={emblorTags}
				setTags={() => {}}
				onTagAdd={onTagAdd}
				onTagRemove={onTagRemove}
				styleClasses={{
					input: cn(inputVariants(), "pr-10"),
					tagList: {
						container: cn("flex-wrap gap-1"),
					},
					tag: {
						body: cn("relative h-8 w-fit whitespace-nowrap rounded-md border border-input bg-background ps-2 pe-7 font-medium text-sm hover:bg-background"),
						closeButton: cn("-inset-y-px -end-px absolute flex size-8 rounded-s-none rounded-e-lg p-0 text-muted-foreground/80 outline-0 transition-colors hover:text-foreground"),
					},
				}}
				inlineTags={false}
				inputFieldPosition="top"
				activeTagIndex={activeTagIndex}
				setActiveTagIndex={setActiveTagIndex}
				draggable={false}
				className="flex-col-reverse"
				placeholder='"↵" to add'
				{...props}
			/>

			<Button
				className="absolute top-0.5 right-1"
				size="iconSm"
				variant="text"
				onClick={e => {
					onClearAll()
					e.preventDefault()
				}}
			>
				<XIcon />
			</Button>
		</div>
	)
}

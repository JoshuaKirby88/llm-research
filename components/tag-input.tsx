"use client"

import { cn } from "@/utils/cn"
import { TagInput as EmplorTagInput, TagInputProps } from "emblor"
import { useState } from "react"
import { Shortcut } from "./shortcut"
import { inputVariants } from "./ui/input"

type Props = Partial<Omit<TagInputProps, "tags" | "onTagAdd" | "onTagRemove">> & { tags: string[]; onTagAdd: (tag: string) => void; onTagRemove: (tag: string) => void }

export const TagInput = ({ tags, onTagAdd, onTagRemove, className, ...props }: Props) => {
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
					input: inputVariants(),
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
				{...props}
			/>

			<Shortcut shortcut="enter" className="absolute top-0 right-1" />
		</div>
	)
}

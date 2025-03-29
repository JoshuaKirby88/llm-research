"use client"

import { TagInput as EmplorTagInput, TagInputProps } from "emblor"
import { useState } from "react"
import { inputVariants } from "./ui/input"

type Props = Partial<Omit<TagInputProps, "tags" | "onTagAdd" | "onTagRemove">> & { tags: string[]; onTagAdd: (tag: string) => void; onTagRemove: (tag: string) => void }

export const TagInput = ({ tags, onTagAdd, onTagRemove, ...props }: Props) => {
	const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
	const emblorTags = tags.map(tag => ({ id: tag, text: tag }))

	return (
		<EmplorTagInput
			tags={emblorTags}
			setTags={() => {}}
			onTagAdd={onTagAdd}
			onTagRemove={onTagRemove}
			styleClasses={{
				tagList: {
					container: "gap-1 mt-2",
				},
				input: inputVariants(),
				tag: {
					body: "relative h-8 bg-background border border-input hover:bg-background rounded-md font-medium text-sm ps-2 pe-7",
					closeButton: "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-lg flex size-8 transition-colors outline-0 text-muted-foreground/80 hover:text-foreground",
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
	)
}

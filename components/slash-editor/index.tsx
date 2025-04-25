"use client"

import { SlashEditorFeature } from "@/src/features/slash-editor.feature"
import { cn } from "@/utils/cn"
import Document from "@tiptap/extension-document"
import Mention from "@tiptap/extension-mention"
import Paragraph from "@tiptap/extension-paragraph"
import Placeholder from "@tiptap/extension-placeholder"
import Text from "@tiptap/extension-text"
import { ReactRenderer } from "@tiptap/react"
import { EditorContent, useEditor } from "@tiptap/react"
import { LucideIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import tippy, { GetReferenceClientRect, Instance, Props as TippyProps } from "tippy.js"
import { textareaVariants } from "../ui/textarea"
import { SlashCommand } from "./slash-command"

export type Suggestion = { id: string; icon: LucideIcon; label: string; description: string }

export const SlashEditor = (props: { suggestions: Suggestion[]; emptyLabel?: string; placeholder?: string; value?: string; onChange?: (str: string) => void }) => {
	const suggestionsRef = useRef(props.suggestions)

	useEffect(() => {
		suggestionsRef.current = props.suggestions
	}, [props.suggestions])

	const editor = useEditor({
		extensions: [
			Document,
			Paragraph.configure({
				HTMLAttributes: {
					class: cn("first:before:pointer-events-none first:before:float-left first:before:h-0 first:before:text-muted-foreground first:before:content-[attr(data-placeholder)]"),
				},
			}),
			Text,
			Placeholder.configure({
				placeholder: props.placeholder,
			}),
			Mention.configure({
				HTMLAttributes: {
					class: cn("rounded-md border bg-muted px-1.5 py-0.5 text-sm"),
				},
				suggestion: {
					char: "/",
					items(input) {
						return suggestionsRef.current.filter(s => s.label.toLowerCase().startsWith(input.query.toLowerCase()))
					},
					render() {
						let component: ReactRenderer<typeof SlashCommand>
						let popup: Instance<TippyProps>[]

						return {
							onStart(input) {
								component = new ReactRenderer(SlashCommand, {
									props: { ...input, emptyLabel: props.emptyLabel } satisfies React.ComponentProps<typeof SlashCommand>,
									editor: input.editor,
								})

								if (!input.clientRect) {
									return
								}

								popup = tippy("body", {
									getReferenceClientRect: input.clientRect as GetReferenceClientRect,
									appendTo: () => document.body,
									content: component.element,
									showOnCreate: true,
									interactive: true,
									trigger: "manual",
									placement: "bottom-start",
								})
							},
							onUpdate(input) {
								component.updateProps(input)

								if (!input.clientRect) {
									return
								}

								popup[0].setProps({
									getReferenceClientRect: input.clientRect as GetReferenceClientRect,
								})
							},
							onKeyDown(input) {
								if (input.event.key === "Escape") {
									popup[0].hide()
									return true
								}

								return (component.ref as any).onKeyDown(input)
							},
							onExit() {
								popup[0].destroy()
								component.destroy()
							},
						}
					},
				},
				deleteTriggerWithBackspace: true,
				renderHTML(input) {
					return ["span", input.options.HTMLAttributes, input.node.attrs.label]
				},
			}),
		],
		editorProps: {
			attributes: {
				class: cn(textareaVariants(), "block"),
			},
		},
		onUpdate: props.onChange
			? input => {
					props.onChange?.(SlashEditorFeature.stringifyTiptap(input.editor.getJSON()))
				}
			: undefined,
		immediatelyRender: false,
		content: props.value ? SlashEditorFeature.parseTiptap(props.value) : "",
	})

	useEffect(() => {
		if (!editor || SlashEditorFeature.stringifyTiptap(editor.getJSON()) === props.value) {
			return
		}

		editor.commands.setContent(props.value ? SlashEditorFeature.parseTiptap(props.value) : "")
	}, [props.value, editor])

	return <EditorContent editor={editor} />
}

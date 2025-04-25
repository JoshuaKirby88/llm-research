import { JSONContent } from "@tiptap/react"
import { VariableTable } from "../tables"

export class SlashEditorFeature {
	static stringifyTiptap(content: JSONContent) {
		return JSON.stringify(content)
	}

	static parseTiptap(content: string) {
		return JSON.parse(content)
	}

	static stringifyToCustom(segments: JSONContent | JSONContent[], glue?: string): string {
		if (Array.isArray(segments)) {
			return segments.map(segment => this.stringifyToCustom(segment)).join(glue)
		}

		if (segments.type === "doc" && segments.content) {
			return this.stringifyToCustom(segments.content, "\n")
		}
		if (segments.type === "paragraph" && segments.content) {
			return this.stringifyToCustom(segments.content, "")
		}
		if (segments.type === "text" && segments.text) {
			return segments.text
		}
		if (segments.type === "mention" && segments.attrs) {
			return VariableTable.toVar(segments.attrs.id)
		}

		return ""
	}

	static parseCustom(content: string): JSONContent {
		const segments = content.split("\n").map(line => {
			const parts = line.split(/(\{\{[^}]+\}\})/g).filter(p => p.length > 0)

			const children = parts.map(part => {
				const m = part.match(/^\{\{(.+?)\}\}$/)
				if (m) {
					const id = m[1]
					return { type: "mention", attrs: { id, label: id } }
				} else {
					return { type: "text", text: part }
				}
			})

			return { type: "paragraph", content: children }
		})

		return {
			type: "doc",
			content: segments,
		}
	}

	static tiptapStringToCustomString(content: string) {
		return this.stringifyToCustom(this.parseTiptap(content))
	}

	static customStringToTiptapString(content: string) {
		return this.stringifyTiptap(this.parseCustom(content))
	}
}

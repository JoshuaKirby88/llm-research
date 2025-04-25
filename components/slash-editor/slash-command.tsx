import { cn } from "@/utils/cn"
import type { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion"
import { Ref, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Suggestion } from "."

export const SlashCommand = forwardRef((props: { emptyLabel?: string } & SuggestionProps<Suggestion>, ref: Ref<any>) => {
	const [selectedIndex, setSelectedIndex] = useState(0)

	useEffect(() => setSelectedIndex(0), [props.items])

	const selectItem = (index: number) => {
		props.command(props.items[index])
	}

	useImperativeHandle(ref, () => ({
		onKeyDown: (input: SuggestionKeyDownProps) => {
			if (input.event.key === "ArrowUp") {
				setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
				return true
			}

			if (input.event.key === "ArrowDown") {
				setSelectedIndex((selectedIndex + 1) % props.items.length)
				return true
			}

			if (input.event.key === "Enter") {
				selectItem(selectedIndex)
				return true
			}

			return false
		},
	}))

	return (
		<div className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-2xl border bg-background p-1 transition-all">
			{props.items.length ? (
				props.items.map((item, i) => (
					<button
						key={i}
						data-state={i === selectedIndex ? "active" : "inactive"}
						onClick={() => selectItem(i)}
						className={cn("group flex w-full items-center space-x-2 rounded-xl p-1 pr-5 text-left text-sm", "hover:bg-accent data-[state=active]:bg-accent")}
					>
						<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background">
							<item.icon
								className={cn(
									"size-4.5! text-muted-foreground transition-all",
									"group-hover:size-5! group-hover:text-foreground group-data-[state=active]:size-5! group-data-[state=active]:text-foreground",
								)}
							/>
						</div>
						<div>
							<p className="font-medium">{item.label}</p>
							<p className="line-clamp-1 text-muted-foreground text-xs">{item.description}</p>
						</div>
					</button>
				))
			) : (
				<div className="px-2 text-muted-foreground text-sm">{props.emptyLabel ?? "No result"}</div>
			)}
		</div>
	)
})

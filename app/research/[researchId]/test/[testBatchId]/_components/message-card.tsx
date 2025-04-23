import { Dialog } from "@/components/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BlockingVariableCombinationT, IndependentValueT, IndependentVariableT, MessagePromptT, MessageT } from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { cn } from "@/utils/cn"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	blockingVariableCombination: BlockingVariableCombinationT
	messagePrompts: MessagePromptT[]
	messages: MessageT[]
	message: MessageT
}

export const MessageCard = (props: Props) => {
	const messagePrompt = props.messagePrompts.find(mp => mp.id === props.message.messagePromptId)
	const replacedMessagePrompt =
		messagePrompt &&
		VariableTable.replaceVariables(messagePrompt.text, {
			independentVariable: props.independentVariable,
			independentValue: props.independentValue,
			blockingVariableCombination: props.blockingVariableCombination,
			messages: props.messages,
		})

	return (
		<div
			key={props.message.id}
			className={cn(
				"w-full space-y-3 rounded-lg p-3",
				props.message.role === "system"
					? "border border-yellow-200 bg-yellow-50 text-yellow-800"
					: props.message.role === "user"
						? "border border-gray-200 bg-gray-100 text-gray-800"
						: "border border-blue-200 bg-blue-50 text-blue-800",
			)}
		>
			<div className="flex items-center justify-between">
				<span className="font-medium capitalize">{props.message.role}</span>

				<div className="flex items-center gap-2">
					<div className="text-muted-foreground text-xs">
						Input Tokens: {props.message.promptTokens}, Output Tokens: {props.message.completionTokens}
					</div>

					{replacedMessagePrompt && (
						<Dialog
							triggerButton={
								<Button size="xs" variant="outline">
									View Prompt
								</Button>
							}
							contentProps={{ className: "max-w-5xl max-h-[80%] flex flex-col p-0" }}
						>
							<div className="overflow-y-auto p-4">
								<p className="whitespace-pre-wrap">{replacedMessagePrompt.repeat(2)}</p>
							</div>
						</Dialog>
					)}
				</div>
			</div>

			<Separator />

			<div className="whitespace-pre-wrap">{props.message.content}</div>
		</div>
	)
}

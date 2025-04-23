import { Dialog } from "@/components/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BlockingVariableCombinationT, EvalPromptT, EvalT, IndependentValueT, IndependentVariableT, MessagePromptT, MessageT } from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { cn } from "@/utils/cn"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	blockingVariableCombination: BlockingVariableCombinationT
	messages: MessageT[]
} & ({ messagePrompts: MessagePromptT[]; message: MessageT } | { evalPrompt: EvalPromptT; eval: EvalT })

export const MessageCard = (props: Props) => {
	const messageOrEval = "message" in props ? props.message : props.eval
	const prompt = "messagePrompts" in props ? props.messagePrompts.find(mp => mp.id === (messageOrEval as MessageT).messagePromptId) : props.evalPrompt

	const replacedPrompt =
		prompt &&
		VariableTable.replaceVariables(prompt.text, {
			independentVariable: props.independentVariable,
			independentValue: props.independentValue,
			blockingVariableCombination: props.blockingVariableCombination,
			messages: props.messages,
		})

	return (
		<div
			key={messageOrEval.id}
			className={cn(
				"w-full space-y-3 rounded-lg border p-3",
				"role" in messageOrEval ? (messageOrEval.role === "system" ? "" : messageOrEval.role === "user" ? "bg-background" : "bg-muted") : "bg-green-950",
			)}
		>
			<div className="flex items-center justify-between">
				<span className="font-medium capitalize">{"role" in messageOrEval ? messageOrEval.role : "Evaluation"}</span>

				<div className="flex items-center gap-2">
					<div className="text-muted-foreground text-xs">
						Input Tokens: {messageOrEval.promptTokens}, Output Tokens: {messageOrEval.completionTokens}
					</div>

					{replacedPrompt && (
						<Dialog
							triggerButton={
								<Button size="xs" variant="outline">
									View Prompt
								</Button>
							}
							contentProps={{ className: "max-w-5xl max-h-[80%] flex flex-col p-0" }}
						>
							<div className="overflow-y-auto p-4">
								<p className="whitespace-pre-wrap">{replacedPrompt.repeat(2)}</p>
							</div>
						</Dialog>
					)}
				</div>
			</div>

			<Separator />

			<div className="whitespace-pre-wrap">{messageOrEval.content}</div>
		</div>
	)
}

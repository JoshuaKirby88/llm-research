import { Dialog } from "@/components/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ColorFeature } from "@/src/features"
import { BlockingVariableCombinationT, DependentValueT, EvalPromptT, EvalT, IndependentValueT, IndependentVariableT, MessagePromptT, MessageT } from "@/src/schemas"
import { VariableTable } from "@/src/tables"
import { cn } from "@/utils/cn"
import { includes } from "@/utils/includes"

type Props = {
	independentVariable: IndependentVariableT
	independentValue: IndependentValueT
	blockingVariableCombination: BlockingVariableCombinationT
	dependentValue: DependentValueT
	messages: MessageT[]
} & ({ messagePrompts: MessagePromptT[]; message: MessageT } | { evalPrompt: EvalPromptT; eval: EvalT })

export const MessageCard = (props: Props) => {
	const messageOrEval = "message" in props ? { type: "message" as const, ...props.message } : { type: "eval" as const, ...props.eval }
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
			className={cn(
				"w-full space-y-3 rounded-xl border p-3",
				messageOrEval.type === "message" && (includes(messageOrEval.role, ["system", "user"]) ? "bg-background" : messageOrEval.role === "assistant" ? "bg-muted" : ""),
			)}
			style={{ backgroundColor: messageOrEval.type === "eval" ? ColorFeature.oklchWithAlpha(props.dependentValue.color, 0.1) : undefined }}
		>
			<div className="flex items-center justify-between">
				<span className="font-medium capitalize">{messageOrEval.type === "message" ? messageOrEval.role : "Evaluation"}</span>

				<div className="flex items-center gap-2">
					<div className="text-muted-foreground text-xs">
						Input Tokens: {messageOrEval.promptTokens}, Output Tokens: {messageOrEval.completionTokens}
					</div>

					{replacedPrompt?.length && (
						<Dialog
							triggerButton={
								<Button size="xs" variant="outline">
									View Prompt
								</Button>
							}
							contentProps={{ className: "max-w-5xl max-h-[80%] flex flex-col p-0" }}
							xButton
						>
							<div className="overflow-y-auto p-4">
								<p className="whitespace-pre-wrap">
									{replacedPrompt.map((obj, i) =>
										obj.type === "text" ? (
											obj.text
										) : (
											<div key={i} className={"inline-flex rounded-md border bg-muted px-1 "}>
												{obj.name}: {obj.text}
											</div>
										),
									)}
								</p>
							</div>
						</Dialog>
					)}
				</div>
			</div>

			<Separator style={{ backgroundColor: messageOrEval.type === "eval" ? ColorFeature.oklchWithAlpha(props.dependentValue.color, 0.2) : undefined }} />

			<div className={cn("whitespace-pre-wrap", messageOrEval.type === "eval" && "font-bold")} style={{ color: messageOrEval.type === "eval" ? props.dependentValue.color : undefined }}>
				{messageOrEval.content}
			</div>
		</div>
	)
}

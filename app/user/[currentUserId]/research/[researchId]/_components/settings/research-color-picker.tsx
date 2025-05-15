import { updateDependentValueColorAction } from "@/actions/dependent-value/update-dependent-value-color.action"
import { ColorPicker } from "@/components/color-picker"
import { FormButton } from "@/components/form/server/form-button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorFeature } from "@/src/features"
import { DependentValueT } from "@/src/schemas"
import { callFormAction } from "@/utils/actions/call-form-action"

export const ResearchColorPicker = (props: { dependentValues: DependentValueT[] }) => {
	const onSubmit = async (formData: FormData) => {
		"use server"

		await callFormAction(updateDependentValueColorAction, { key: "form", formData }, { oldDependentValues: props.dependentValues })
	}

	return (
		<form className="space-y-6" action={onSubmit}>
			<Label size="xl" className="mb-4">
				Dependent Variable Colors
			</Label>

			<Tabs className="space-y-2" defaultValue={props.dependentValues[0].id.toString()}>
				<TabsList className="gap-2 bg-transparent">
					{props.dependentValues.map(dependentValue => (
						<TabsTrigger
							key={dependentValue.id}
							value={dependentValue.id.toString()}
							className="rounded-full border-2 font-bold data-[state=inactive]:border-transparent! data-[state=active]:shadow-none"
							style={{
								color: dependentValue.color,
								backgroundColor: ColorFeature.oklchWithAlpha(dependentValue.color, 0.1),
								borderColor: dependentValue.color,
							}}
						>
							{dependentValue.value}
						</TabsTrigger>
					))}
				</TabsList>

				{props.dependentValues.map(dependentValue => (
					<TabsContent key={dependentValue.id} value={dependentValue.id.toString()} forceMount className="m-0 data-[state=inactive]:pointer-events-none data-[state=inactive]:hidden">
						<ColorPicker name={dependentValue.id.toString()} defaultValue={dependentValue.color} />
					</TabsContent>
				))}
			</Tabs>

			<FormButton>Save</FormButton>
		</form>
	)
}

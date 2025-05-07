import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ColorFeature } from "@/src/features/color.feature"
import { cn } from "@/utils/cn"

export const ColorPicker = (props: React.ComponentProps<typeof RadioGroup>) => {
	return (
		<RadioGroup {...props} className={cn("flex gap-2", props.className)}>
			{ColorFeature.colors.map(color => {
				const colorValue = ColorFeature.oklchMap[color]

				return <RadioGroupItem key={color} id={color} value={colorValue} className="size-6" style={{ backgroundColor: colorValue }} />
			})}
		</RadioGroup>
	)
}

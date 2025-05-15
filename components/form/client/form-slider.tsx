"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useSliderWithInput } from "@/hooks/use-slider-with-input"
import { useFormContext } from "react-hook-form"

export const FormSlider = (props: { label?: string; name: string; minValue?: number; maxValue?: number }) => {
	const form = useFormContext()
	const initialValue = form.control._defaultValues[props.name]
	const formSliderValue = form.watch(props.name)
	const { sliderValue, inputValues, validateAndUpdateValue, handleInputChange, handleSliderChange } = useSliderWithInput({
		minValue: props.minValue,
		maxValue: props.maxValue,
		initialValue,
		sliderValue: formSliderValue,
		setSliderValue: value => form.setValue(props.name, value),
	})

	return (
		<div>
			{props.label && <Label>{props.label}</Label>}

			<div className="flex items-center gap-4">
				<Slider className="grow" value={sliderValue} onValueChange={handleSliderChange} min={props.minValue} max={props.maxValue} />

				<Input
					className="h-8 w-12 px-2 py-1"
					type="text"
					inputMode="decimal"
					value={inputValues[0]}
					onChange={e => handleInputChange(e, 0)}
					onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
					onKeyDown={e => {
						if (e.key === "Enter") {
							validateAndUpdateValue(inputValues[0], 0)
							e.preventDefault()
						}
					}}
				/>
			</div>
		</div>
	)
}

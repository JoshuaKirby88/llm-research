"use client"

import { useCallback, useState } from "react"

type UseSliderWithInputProps = {
	minValue?: number
	maxValue?: number
	initialValue?: number[]
	defaultValue?: number[]
	sliderValue?: number[]
	setSliderValue?: (sliderValue: number[]) => void
	inputValues?: string[]
	setInputValues?: (inputValues: string[]) => void
}

export function useSliderWithInput({ minValue = 0, maxValue = 100, initialValue = [minValue], defaultValue = [minValue], ...props }: UseSliderWithInputProps) {
	const [sliderValue, setSliderValue] = useState(initialValue)
	const [inputValues, setInputValues] = useState(initialValue.map(v => v.toString()))
	const states = {
		slider: props.sliderValue ?? sliderValue,
		setSlider: props.setSliderValue ?? setSliderValue,
		input: props.inputValues ?? inputValues,
		setInput: props.setInputValues ?? setInputValues,
	}

	const showReset = states.slider.length === defaultValue.length && !states.slider.every((value, index) => value === defaultValue[index])

	const validateAndUpdateValue = useCallback(
		(rawValue: string, index: number) => {
			if (rawValue === "" || rawValue === "-") {
				const newInputValues = [...states.input]
				newInputValues[index] = "0"
				states.setInput(newInputValues)

				const newSliderValues = [...states.slider]
				newSliderValues[index] = 0
				states.setSlider(newSliderValues)
				return
			}

			const numValue = parseFloat(rawValue)

			if (isNaN(numValue)) {
				const newInputValues = [...states.input]
				newInputValues[index] = states.slider[index]!.toString()
				states.setInput(newInputValues)
				return
			}

			let clampedValue = Math.min(maxValue, Math.max(minValue, numValue))

			if (states.slider.length > 1) {
				if (index === 0) {
					clampedValue = Math.min(clampedValue, states.slider[1]!)
				} else {
					clampedValue = Math.max(clampedValue, states.slider[0]!)
				}
			}

			const newSliderValues = [...states.slider]
			newSliderValues[index] = clampedValue
			states.setSlider(newSliderValues)

			const newInputValues = [...states.input]
			newInputValues[index] = clampedValue.toString()
			states.setInput(newInputValues)
		},
		[states.slider, states.input, minValue, maxValue],
	)

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>, index: number) => {
			const newValue = e.target.value
			if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
				const newInputValues = [...states.input]
				newInputValues[index] = newValue
				states.setInput(newInputValues)
			}
		},
		[states.input],
	)

	const handleSliderChange = useCallback((newValue: number[]) => {
		states.setSlider(newValue)
		states.setInput(newValue.map(v => v.toString()))
	}, [])

	const resetToDefault = useCallback(() => {
		states.setSlider(defaultValue)
		states.setInput(defaultValue.map(v => v.toString()))
	}, [defaultValue])

	return {
		sliderValue: states.slider,
		inputValues: states.input,
		validateAndUpdateValue,
		handleInputChange,
		handleSliderChange,
		resetToDefault,
		showReset,
	}
}

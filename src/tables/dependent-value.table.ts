import { ColorFeature } from "../features/color.feature"
import { DependentValueT } from "../schemas"

export class DependentValueTable {
	static assignColors<T extends Partial<DependentValueT>>(dependentValues: T[]) {
		return dependentValues.map((dVal, i) => {
			const step = 5
			const n = ColorFeature.colors.length
			const offset = Math.floor(Math.random() * n)
			const index = (i * step + offset) % n

			return { ...dVal, color: Object.values(ColorFeature.oklchMap)[index] }
		})
	}
}

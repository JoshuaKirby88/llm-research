export type Color = (typeof ColorFeature.colors)[number]

export class ColorFeature {
	static oklchMap = {
		red: "oklch(63.7% 0.237 25.331)",
		orange: "oklch(70.5% 0.213 47.604)",
		amber: "oklch(76.9% 0.188 70.08)",
		yellow: "oklch(79.5% 0.184 86.047)",
		lime: "oklch(76.8% 0.233 130.85)",
		green: "oklch(72.3% 0.219 149.579)",
		emerald: "oklch(69.6% 0.17 162.48)",
		teal: "oklch(70.4% 0.14 182.503)",
		cyan: "oklch(71.5% 0.143 215.221)",
		sky: "oklch(68.5% 0.169 237.323)",
		blue: "oklch(62.3% 0.214 259.815)",
		indigo: "oklch(58.5% 0.233 277.117)",
		violet: "oklch(60.6% 0.25 292.717)",
		purple: "oklch(62.7% 0.265 303.9)",
		fuchsia: "oklch(66.7% 0.295 322.15)",
		pink: "oklch(65.6% 0.241 354.308)",
		rose: "oklch(64.5% 0.246 16.439)",
	}
	static colors = Object.keys(this.oklchMap) as (keyof typeof this.oklchMap)[]

	static oklchWithAlpha(oklch: string, alpha: number) {
		const safeAlpha = Math.max(0, Math.min(1, alpha))
		return oklch.replace(/\/\s*[\d.]+\s*\)?$/, ")").replace(/\)$/, ` / ${safeAlpha})`)
	}
}

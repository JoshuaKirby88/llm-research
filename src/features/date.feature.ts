export class DateFeature {
	static toMonthYear(date: Date): string {
		const month = date.toLocaleString("en-US", { month: "long" })
		const year = date.getFullYear()
		return `${month} ${year}`
	}
}

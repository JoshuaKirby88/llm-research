import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import { FilterXIcon } from "lucide-react"
import type { DataTableFilterActions } from "../core/types"
import { type Locale, t } from "../lib/i18n"

interface FilterActionsProps {
	hasFilters: boolean
	actions?: DataTableFilterActions
	locale?: Locale
}

export function FilterActions({ hasFilters, actions, locale = "en" }: FilterActionsProps) {
	return (
		<Button className={cn(!hasFilters && "hidden")} size="xs" variant="red" onClick={actions?.removeAllFilters}>
			<FilterXIcon />
			<span className="hidden md:block">{t("clear", locale)}</span>
		</Button>
	)
}

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/utils/cn"
import { ComponentProps } from "react"

export const FormCard = (props: ComponentProps<typeof Card>) => {
	return <Card size="none" {...props} className={cn("rounded-md", props.className)} />
}

export const FormCardHeader = (props: ComponentProps<"div">) => {
	return <div {...props} className={cn("border-b bg-accent p-4", props.className)} />
}

export const FormCardContent = (props: ComponentProps<typeof CardContent>) => {
	return <CardContent {...props} className={cn("space-y-4 bg-background p-4", props.className)} />
}

export const FormCardFooter = (props: ComponentProps<typeof CardFooter>) => {
	return <CardFooter {...props} className={cn("border-t bg-accent p-4", props.className)} />
}

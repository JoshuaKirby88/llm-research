import Image from "next/image"

export const EmptyStateImage = (props: { title: string; description?: string; src: string; alt: string }) => {
	return (
		<div className="mt-20 flex flex-col items-center">
			<Image src={props.src} width={125} height={125} alt={props.alt} />
			<div className="text-center text-muted-foreground">
				<h3 className="font-semibold text-xl">{props.title}</h3>
				{props.description && <p className="font-semibold text-sm opacity-70">{props.description}</p>}
			</div>
		</div>
	)
}

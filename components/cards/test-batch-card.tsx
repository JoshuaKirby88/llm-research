import { TestBatchT, TestModelBatchT } from "@/src/schemas"
import { User } from "@clerk/nextjs/server"
import Link from "next/link"
import { ClerkPFP } from "../clerk/clerk-pfp"
import { CardFooter, CardHeader, cardVariants } from "../ui/card"

type Props = {
	testBatch: TestBatchT
	testModelBatches: TestModelBatchT[]
}

export const TestBatchCard = (props: { user: User | undefined; children?: React.ReactNode } & Props) => {
	return (
		<div className="relative">
			<Link href={`/user/${props.user?.id}/research/${props.testBatch.researchId}/test/${props.testBatch.id}`} className={cardVariants({ padding: "sm" })}>
				<CardHeader>
					<p className="text-muted-foreground">{props.testBatch.createdAt.toLocaleDateString()}</p>
					<p>Models: {props.testModelBatches.map(tmb => tmb.model).join(", ")}</p>
					<p>Iterations: {props.testBatch.iterations}</p>
					<p>Total iterations: {props.testBatch.testCount}</p>
				</CardHeader>
				Show results, copying Luma cards
				{props.children}
				<CardFooter>
					<ClerkPFP size="sm" user={props.user} />
				</CardFooter>
			</Link>
		</div>
	)
}

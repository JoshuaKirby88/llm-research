import { Button, buttonVariants } from "@/components/ui/button"
import { authProcedure } from "@/utils/auth-procedure"
import { cn } from "@/utils/cn"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { CogIcon } from "lucide-react"
import Link from "next/link"
import { NavbarBreadCrumb } from "./navbar-breadcrumb"
import { ThemeDropdown } from "./theme-dropdown"

export const Navbar = async () => {
	const user = await authProcedure("public")

	return (
		<header className="fixed z-10 flex w-full items-center justify-between bg-background px-4 py-2">
			<NavbarBreadCrumb />

			<div className="flex items-center gap-4">
				<SignedIn>
					<Link className={cn(buttonVariants({ size: "sm" }), "ml-auto")} href="/new">
						New Research
					</Link>

					<Link className={cn(buttonVariants({ variant: "text", size: "sm" }))} href={`/user/${user.userId}?tab=Research`}>
						Your Research
					</Link>

					<Link href="/settings" className={buttonVariants({ size: "iconSm", variant: "text" })}>
						<CogIcon />
					</Link>
				</SignedIn>

				<ThemeDropdown variant="text" size="iconSm" />

				<SignedIn>
					<UserButton />
				</SignedIn>

				<SignedOut>
					<SignInButton>
						<Button size="sm" variant="outline">
							Sign In
						</Button>
					</SignInButton>

					<SignUpButton>
						<Button size="sm">Sign Up</Button>
					</SignUpButton>
				</SignedOut>
			</div>
		</header>
	)
}

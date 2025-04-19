import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { CogIcon } from "lucide-react"
import Link from "next/link"
import { NavbarBreadCrumb } from "./navbar-breadcrumb"
import { ThemeDropdown } from "./theme-dropdown"

export const Navbar = () => {
	return (
		<header className="fixed z-10 flex w-full items-center justify-between bg-background px-4 py-2">
			<NavbarBreadCrumb />

			<div className="flex items-center gap-4">
				<SignedIn>
					<Link className={cn(buttonVariants({ size: "sm" }), "ml-auto")} href="/new">
						New Research
					</Link>

					<Link className={cn(buttonVariants({ variant: "text", size: "sm" }))} href="/research">
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
					<SignInButton />
					<SignUpButton />
				</SignedOut>
			</div>
		</header>
	)
}

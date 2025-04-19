import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { CogIcon } from "lucide-react"
import Link from "next/link"
import { ThemeDropdown } from "./theme-dropdown"
import { NavbarBreadCrumb } from "./navbar-breadcrumb"

export const Navbar = () => {
	return (
		<header className="fixed z-10 flex w-full items-center gap-4 bg-background px-4 py-2">
			<NavbarBreadCrumb />

			<Link className={cn(buttonVariants({ size: "sm" }), "ml-auto")} href="/new">
				New Research
			</Link>

			<Link className={cn(buttonVariants({ variant: "text", size: "sm" }))} href="/research">
				Your Research
			</Link>

			<Link href="/settings" className={buttonVariants({ size: "iconSm", variant: "text" })}>
				<CogIcon />
			</Link>

			<ThemeDropdown variant="text" size="iconSm" />

			<SignedOut>
				<SignInButton />
				<SignUpButton />
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</header>
	)
}

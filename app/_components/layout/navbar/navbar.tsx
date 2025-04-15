import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { CogIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeDropdown } from "./theme-dropdown"

export const Navbar = () => {
	return (
		<header className="fixed z-10 flex h-16 w-full items-center gap-4 border-b bg-background p-4">
			<Link href="/" className={buttonVariants({ size: "icon", variant: "outline" })}>
				<Image src="/emojis/scientist.webp" alt="Scientist" width={25} height={25} />
			</Link>

			<Link href="/settings" className={cn(buttonVariants({ size: "icon", variant: "outline" }), "ml-auto")}>
				<CogIcon />
			</Link>

			<ThemeDropdown />

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

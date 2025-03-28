import type { Metadata } from "next"
import "./globals.css"
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export const metadata: Metadata = {
	title: "LLM Research",
	description: "An open place to research LLM behaviours easily.",
}

const Layout = (props: { children: React.ReactNode }) => {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className="antialiased">
					<header className="flex h-16 items-center justify-end gap-4 p-4">
						<SignedOut>
							<SignInButton />
							<SignUpButton />
						</SignedOut>
						<SignedIn>
							<UserButton />
						</SignedIn>
					</header>

					{props.children}
				</body>
			</html>
		</ClerkProvider>
	)
}

export default Layout

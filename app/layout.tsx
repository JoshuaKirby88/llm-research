import type { Metadata } from "next"
import "./globals.css"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { ClerkProvider } from "./_components/clerk-provider"
import { ThemeDropdown } from "./_components/theme-dropdown"
import { ThemeProvider } from "./_components/theme-provider"

export const metadata: Metadata = {
	title: "LLM Research",
	description: "An open place to research LLM behaviours easily.",
}

const Layout = (props: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body className="antialiased">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<ClerkProvider>
						<header className="flex h-16 items-center justify-end gap-4 p-4">
							<ThemeDropdown />

							<SignedOut>
								<SignInButton />
								<SignUpButton />
							</SignedOut>
							<SignedIn>
								<UserButton />
							</SignedIn>
						</header>

						{props.children}
					</ClerkProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

export default Layout

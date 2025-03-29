import type { Metadata } from "next"
import "./globals.css"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { ClerkProvider } from "./_components/layout/clerk-provider"
import { ThemeDropdown } from "./_components/layout/theme-dropdown"
import { ThemeProvider } from "./_components/layout/theme-provider"

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
						<header className="fixed z-10 flex h-16 w-full items-center justify-end gap-4 border-b bg-background p-4">
							<ThemeDropdown />

							<SignedOut>
								<SignInButton />
								<SignUpButton />
							</SignedOut>
							<SignedIn>
								<UserButton />
							</SignedIn>
						</header>

						<main className="container mx-auto flex flex-col items-center space-y-10 py-40">{props.children}</main>
					</ClerkProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

export default Layout

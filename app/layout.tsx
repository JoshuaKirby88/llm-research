import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "./_components/layout/navbar/navbar"
import { ClerkProvider } from "./_components/layout/providers/clerk-provider"
import { PostHogProvider } from "./_components/layout/providers/post-hog-provider"
import { ThemeProvider } from "./_components/layout/providers/theme-provider"

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
						<PostHogProvider>
							<Navbar />

							<main className="container mx-auto flex flex-col items-center space-y-10 py-40">{props.children}</main>

							<Toaster />
						</PostHogProvider>
					</ClerkProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

export default Layout

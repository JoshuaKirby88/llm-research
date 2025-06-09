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
		<html lang="en" suppressHydrationWarning className="h-full">
			<body className="flex min-h-full flex-col antialiased">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<ClerkProvider>
						<PostHogProvider>
							<Navbar />

							<main className="container mx-auto flex min-h-full grow flex-col items-center space-y-10 pt-40">{props.children}</main>

							<footer className="h-10">
								<Toaster />
							</footer>
						</PostHogProvider>
					</ClerkProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

export default Layout

import { NuqsAdapter } from "nuqs/adapters/next/app"
import { ReactNode } from "react"

const Layout = (props: { children: ReactNode }) => {
	return <NuqsAdapter>{props.children}</NuqsAdapter>
}

export default Layout

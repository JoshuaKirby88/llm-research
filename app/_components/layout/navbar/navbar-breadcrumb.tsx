"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { FlaskConicalIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import React from "react"

const config = {
	nonLinkPaths: ["user"],
}

export const NavbarBreadCrumb = () => {
	const pathname = usePathname()
	const paths = pathname.split("/").filter(Boolean)

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/" className="inline-flex items-center gap-1.5">
						<FlaskConicalIcon />
					</BreadcrumbLink>
				</BreadcrumbItem>

				{paths.length ? <BreadcrumbSeparator /> : null}

				{paths.map((path, i) => (
					<React.Fragment key={i}>
						<BreadcrumbItem className="max-w-24">
							{i < paths.length - 1 && !config.nonLinkPaths.includes(path) ? (
								<BreadcrumbLink href={`/${paths.slice(0, i + 1).join("/")}`} className="truncate capitalize">
									{path}
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage className="truncate capitalize">{path}</BreadcrumbPage>
							)}
						</BreadcrumbItem>

						{i !== paths.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}

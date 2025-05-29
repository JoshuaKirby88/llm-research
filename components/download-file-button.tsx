"use client"

import { DownloadIcon } from "lucide-react"
import { Button, ButtonProps } from "./ui/button"

export const DownloadFileButton = ({ data, fileName, ...props }: { data: string; fileName: string } & ButtonProps) => {
	const onClick = () => {
		const extension = fileName.split(".")[1]
		const blob = new Blob([data], { type: `text/${extension};charset=utf-8;` })

		const url = URL.createObjectURL(blob)
		const link = document.createElement("a")
		link.setAttribute("href", url)
		link.setAttribute("download", fileName)
		link.style.visibility = "hidden"
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	return (
		<Button size="xs" {...props} onClick={onClick}>
			<DownloadIcon />
			Download
		</Button>
	)
}

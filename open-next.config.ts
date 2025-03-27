import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js"

export default {
	default: {
		override: {
			wrapper: "aws-lambda-streaming",
		},
	},

	middleware: {
		external: true,
		runtime: "edge",
	},
} satisfies OpenNextConfig

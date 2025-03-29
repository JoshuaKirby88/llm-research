/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "llm-research",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
			providers: {
				aws: {
					region: "us-east-1",
				},
			},
		}
	},
	async run() {
		new sst.aws.Nextjs("NextJS", {
			environment: {
				DATABASE_URL: process.env.DATABASE_URL!,
				NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
				CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
				XATA_API_KEY: process.env.XATA_API_KEY!,
				XATA_BRANCH: process.env.XATA_BRANCH!,
			},
			transform: {
				server: {
					runtime: "nodejs22.x",
					architecture: "arm64",
				},
			},
			dev: {
				command: "pnpm exec next dev --turbo",
			},
		})
	},
})

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const APIKey = sqliteTable("APIKey", {
	userId: text().primaryKey(),
	openai: text(),
	google: text(),
	anthropic: text(),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const Research = sqliteTable("Research", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	isCompleted: integer({ mode: "boolean" }).default(false),
	userId: text().notNull(),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const Contributor = sqliteTable("Contributor", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	count: integer().notNull(),
	userId: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const IndependentVariable = sqliteTable("IndependentVariable", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	prompt: text(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const IndependentValue = sqliteTable("IndependentValue", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	value: text().notNull(),
	independentVariableId: integer()
		.notNull()
		.references(() => IndependentVariable.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const BlockingVariable = sqliteTable("BlockingVariable", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	prompt: text(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const BlockingValue = sqliteTable("BlockingValue", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	value: text().notNull(),
	blockingVariableId: integer()
		.notNull()
		.references(() => BlockingVariable.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const MessagePrompt = sqliteTable("MessagePrompt", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	role: text({ enum: ["system", "user", "assistant"] }).notNull(),
	text: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const EvalPrompt = sqliteTable("EvalPrompt", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	text: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const ResultEnum = sqliteTable("ResultEnum", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	value: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const TestBatch = sqliteTable("TestBatch", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	count: integer().notNull(),
	contributorId: integer()
		.notNull()
		.references(() => Contributor.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const Test = sqliteTable("Test", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	resultEnumId: integer()
		.notNull()
		.references(() => ResultEnum.id),
	testBatchId: integer()
		.notNull()
		.references(() => TestBatch.id),
	independentValueId: integer()
		.notNull()
		.references(() => IndependentValue.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const TestToBlockingValue = sqliteTable("TestToBlockingValue", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	testId: integer()
		.notNull()
		.references(() => Test.id),
	blockingValueId: integer()
		.notNull()
		.references(() => BlockingValue.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const Message = sqliteTable("Message", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	role: text({ enum: ["system", "user", "assistant"] }).notNull(),
	content: text().notNull(),
	tokens: integer().notNull(),
	testId: integer()
		.notNull()
		.references(() => Test.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const Completion = sqliteTable("Completion", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	content: text().notNull(),
	tokens: integer().notNull(),
	testId: integer()
		.notNull()
		.references(() => Test.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const ResearchResult = sqliteTable("ResearchResult", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	count: integer().notNull(),
	resultEnumId: integer()
		.notNull()
		.references(() => ResultEnum.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

export const TestBatchResult = sqliteTable("TestBatchResult", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	count: integer().notNull(),
	resultEnumId: integer()
		.notNull()
		.references(() => ResultEnum.id),
	testBatchId: integer()
		.notNull()
		.references(() => TestBatch.id),
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
})

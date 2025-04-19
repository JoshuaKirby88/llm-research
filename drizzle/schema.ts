import { and, eq, isNotNull, or, relations, sql } from "drizzle-orm"
import { check, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"

const defaultColumns = {
	createdAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
}

export const APIKey = sqliteTable("APIKey", {
	userId: text().primaryKey(),
	openai: text(),
	google: text(),
	anthropic: text(),
	...defaultColumns,
})

export const Research = sqliteTable(
	"Research",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		name: text().notNull(),
		description: text().notNull().default(""),
		stars: integer().notNull().default(0),
		conclusion: text(),
		isComplete: integer({ mode: "boolean" }).notNull().default(false),
		isArchived: integer({ mode: "boolean" }).notNull().default(false),
		isUserDeleted: integer({ mode: "boolean" }).notNull().default(false),
		userId: text().notNull(),
		...defaultColumns,
	},
	table => [check("isComplete", or(eq(table.isComplete, sql`false`), and(eq(table.isComplete, sql`true`), isNotNull(table.conclusion)))!)],
)

export const UserToStarredResearch = sqliteTable(
	"UserToStarredResearch",
	{
		userId: text().notNull(),
		researchId: integer()
			.notNull()
			.references(() => Research.id, { onDelete: "cascade" }),
		...defaultColumns,
	},
	table => [primaryKey({ columns: [table.userId, table.researchId] })],
)

export const Contributor = sqliteTable("Contributor", {
	id: integer().primaryKey({ autoIncrement: true }),
	count: integer().notNull(),
	userId: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const IndependentVariable = sqliteTable("IndependentVariable", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	prompt: text(),
	researchId: integer()
		.notNull()
		.references(() => Research.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const IndependentValue = sqliteTable("IndependentValue", {
	id: integer().primaryKey({ autoIncrement: true }),
	value: text().notNull(),
	independentVariableId: integer()
		.notNull()
		.references(() => IndependentVariable.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const BlockingVariable = sqliteTable("BlockingVariable", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	prompt: text(),
	researchId: integer()
		.notNull()
		.references(() => Research.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const BlockingValue = sqliteTable("BlockingValue", {
	id: integer().primaryKey({ autoIncrement: true }),
	value: text().notNull(),
	blockingVariableId: integer()
		.notNull()
		.references(() => BlockingVariable.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const MessagePrompt = sqliteTable("MessagePrompt", {
	id: integer().primaryKey({ autoIncrement: true }),
	role: text({ enum: ["system", "user", "assistant"] }).notNull(),
	text: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const EvalPrompt = sqliteTable("EvalPrompt", {
	id: integer().primaryKey({ autoIncrement: true }),
	text: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const ResultEnum = sqliteTable("ResultEnum", {
	id: integer().primaryKey({ autoIncrement: true }),
	value: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const TestBatch = sqliteTable("TestBatch", {
	id: integer().primaryKey({ autoIncrement: true }),
	count: integer().notNull(),
	contributorId: integer()
		.notNull()
		.references(() => Contributor.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const Test = sqliteTable("Test", {
	id: integer().primaryKey({ autoIncrement: true }),
	resultEnumId: integer()
		.notNull()
		.references(() => ResultEnum.id, { onDelete: "cascade" }),
	testBatchId: integer()
		.notNull()
		.references(() => TestBatch.id, { onDelete: "cascade" }),
	independentValueId: integer()
		.notNull()
		.references(() => IndependentValue.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const TestToBlockingValue = sqliteTable("TestToBlockingValue", {
	id: integer().primaryKey({ autoIncrement: true }),
	testId: integer()
		.notNull()
		.references(() => Test.id, { onDelete: "cascade" }),
	blockingValueId: integer()
		.notNull()
		.references(() => BlockingValue.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const Message = sqliteTable("Message", {
	id: integer().primaryKey({ autoIncrement: true }),
	role: text({ enum: ["system", "user", "assistant"] }).notNull(),
	content: text().notNull(),
	tokens: integer().notNull(),
	testId: integer()
		.notNull()
		.references(() => Test.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const Completion = sqliteTable("Completion", {
	id: integer().primaryKey({ autoIncrement: true }),
	content: text().notNull(),
	tokens: integer().notNull(),
	testId: integer()
		.notNull()
		.references(() => Test.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const ResearchResult = sqliteTable("ResearchResult", {
	id: integer().primaryKey({ autoIncrement: true }),
	count: integer().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id, { onDelete: "cascade" }),
	resultEnumId: integer()
		.notNull()
		.references(() => ResultEnum.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const TestBatchResult = sqliteTable("TestBatchResult", {
	id: integer().primaryKey({ autoIncrement: true }),
	count: integer().notNull(),
	resultEnumId: integer()
		.notNull()
		.references(() => ResultEnum.id, { onDelete: "cascade" }),
	testBatchId: integer()
		.notNull()
		.references(() => TestBatch.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const ResearchRelations = relations(Research, ({ many, one }) => ({
	userToStarredResearch: many(UserToStarredResearch),
	contributors: many(Contributor),
	independentVariable: one(IndependentVariable),
	blockingVariables: many(BlockingVariable),
	messagePrompts: many(MessagePrompt),
	evalPrompt: one(EvalPrompt),
}))

export const UserToStarredResearchRelations = relations(UserToStarredResearch, ({ one }) => ({
	research: one(Research, {
		fields: [UserToStarredResearch.researchId],
		references: [Research.id],
	}),
}))

export const ContributorRelations = relations(Contributor, ({ one }) => ({
	research: one(Research, {
		fields: [Contributor.researchId],
		references: [Research.id],
	}),
}))

export const IndependentVariableRelations = relations(IndependentVariable, ({ one, many }) => ({
	research: one(Research, {
		fields: [IndependentVariable.researchId],
		references: [Research.id],
	}),
	independentValues: many(IndependentValue),
}))

export const IndependentValueRelations = relations(IndependentValue, ({ one }) => ({
	independentVariable: one(IndependentVariable, {
		fields: [IndependentValue.independentVariableId],
		references: [IndependentVariable.id],
	}),
}))

export const BlockingVariableRelations = relations(BlockingVariable, ({ one, many }) => ({
	research: one(Research, {
		fields: [BlockingVariable.researchId],
		references: [Research.id],
	}),
	blockingValues: many(BlockingValue),
}))

export const BlockingValueRelations = relations(BlockingValue, ({ one }) => ({
	blockingVariable: one(BlockingVariable, {
		fields: [BlockingValue.blockingVariableId],
		references: [BlockingVariable.id],
	}),
}))

export const MessagePromptRelations = relations(MessagePrompt, ({ one }) => ({
	research: one(Research, {
		fields: [MessagePrompt.researchId],
		references: [Research.id],
	}),
}))

export const EvalPromptRelations = relations(EvalPrompt, ({ one }) => ({
	research: one(Research, {
		fields: [EvalPrompt.researchId],
		references: [Research.id],
	}),
}))

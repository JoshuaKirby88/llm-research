import { AIFeature, AIModelArr } from "@/src/features"
import { and, eq, isNotNull, isNull, or, relations, sql } from "drizzle-orm"
import { AnySQLiteColumn, check, integer, primaryKey, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"

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
		starCount: integer().notNull().default(0),
		conclusion: text(),
		isComplete: integer({ mode: "boolean" }).notNull().default(false),
		isStarred: integer({ mode: "boolean" }).notNull().default(false),
		isArchived: integer({ mode: "boolean" }).notNull().default(false),
		isUserDeleted: integer({ mode: "boolean" }).notNull().default(false),
		userId: text().notNull(),
		forkedResearchId: integer().references((): AnySQLiteColumn => Research.id, { onDelete: "set null" }),
		...defaultColumns,
	},
	table => [check("isComplete", or(and(eq(table.isComplete, sql`false`), isNull(table.conclusion)), and(eq(table.isComplete, sql`true`), isNotNull(table.conclusion)))!)],
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

export const Contributor = sqliteTable(
	"Contributor",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		count: integer().notNull(),
		userId: text().notNull(),
		researchId: integer()
			.notNull()
			.references(() => Research.id, { onDelete: "cascade" }),
		...defaultColumns,
	},
	table => [unique().on(table.userId, table.researchId)],
)

export const IndependentVariable = sqliteTable("IndependentVariable", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	prompt: text(),
	researchId: integer()
		.notNull()
		.unique()
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
		.unique()
		.references(() => Research.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const DependentValue = sqliteTable("DependentValue", {
	id: integer().primaryKey({ autoIncrement: true }),
	value: text().notNull(),
	color: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const TestBatch = sqliteTable("TestBatch", {
	id: integer().primaryKey({ autoIncrement: true }),
	// Maybe give this a better name?
	// This is the model for generating the messages, to test the LLM model in subject
	model: text({ enum: AIFeature.models as AIModelArr }).notNull(),
	iterations: integer().notNull(),
	testCount: integer().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id, { onDelete: "cascade" }),
	contributorId: integer()
		.notNull()
		.references(() => Contributor.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const TestModelBatch = sqliteTable(
	"TestModelBatch",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		testCount: integer().notNull(),
		model: text({ enum: AIFeature.models as AIModelArr }).notNull(),
		testBatchId: integer()
			.notNull()
			.references(() => TestBatch.id, { onDelete: "cascade" }),
		...defaultColumns,
	},
	table => [unique().on(table.testBatchId, table.model)],
)

export const Test = sqliteTable("Test", {
	id: integer().primaryKey({ autoIncrement: true }),
	independentValueId: integer()
		.notNull()
		.references(() => IndependentValue.id, { onDelete: "cascade" }),
	dependentValueId: integer()
		.notNull()
		.references(() => DependentValue.id, { onDelete: "cascade" }),
	testModelBatchId: integer()
		.notNull()
		.references(() => TestModelBatch.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const TestToBlockingValue = sqliteTable(
	"TestToBlockingValue",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		testId: integer()
			.notNull()
			.references(() => Test.id, { onDelete: "cascade" }),
		blockingValueId: integer()
			.notNull()
			.references(() => BlockingValue.id, { onDelete: "cascade" }),
		...defaultColumns,
	},
	table => [unique().on(table.testId, table.blockingValueId)],
)

export const Message = sqliteTable(
	"Message",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		role: text({ enum: ["system", "user", "assistant"] }).notNull(),
		content: text().notNull(),
		promptTokens: integer().notNull(),
		completionTokens: integer().notNull(),
		isCompletion: integer({ mode: "boolean" }).notNull(),
		testId: integer()
			.notNull()
			.references(() => Test.id, { onDelete: "cascade" }),
		messagePromptId: integer().references(() => MessagePrompt.id, { onDelete: "cascade" }),
		...defaultColumns,
	},
	table => [check("messagePromptId", or(and(eq(table.isCompletion, sql`false`), isNotNull(table.messagePromptId)), and(eq(table.isCompletion, sql`true`), isNull(table.messagePromptId)))!)],
)

export const Eval = sqliteTable("Eval", {
	id: integer().primaryKey({ autoIncrement: true }),
	content: text().notNull(),
	promptTokens: integer().notNull(),
	completionTokens: integer().notNull(),
	testId: integer()
		.notNull()
		.unique()
		.references(() => Test.id, { onDelete: "cascade" }),
	evalPromptId: integer()
		.notNull()
		.references(() => EvalPrompt.id, { onDelete: "cascade" }),
	...defaultColumns,
})

export const ResearchResult = sqliteTable(
	"ResearchResult",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		count: integer().notNull(),
		researchId: integer()
			.notNull()
			.references(() => Research.id, { onDelete: "cascade" }),
		dependentValueId: integer()
			.notNull()
			.references(() => DependentValue.id, { onDelete: "cascade" }),
		...defaultColumns,
	},
	table => [unique().on(table.researchId, table.dependentValueId)],
)

export const TestBatchResult = sqliteTable(
	"TestBatchResult",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		count: integer().notNull(),
		testBatchId: integer()
			.notNull()
			.references(() => TestBatch.id, { onDelete: "cascade" }),
		dependentValueId: integer()
			.notNull()
			.references(() => DependentValue.id, { onDelete: "cascade" }),
		...defaultColumns,
	},
	table => [unique().on(table.testBatchId, table.dependentValueId)],
)

export const TestModelBatchResult = sqliteTable(
	"TestModelBatchResult",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		count: integer().notNull(),
		testModelBatchId: integer()
			.notNull()
			.references(() => TestModelBatch.id, { onDelete: "cascade" }),
		dependentValueId: integer()
			.notNull()
			.references(() => DependentValue.id, { onDelete: "cascade" }),
		...defaultColumns,
	},
	table => [unique().on(table.testModelBatchId, table.dependentValueId)],
)

export const ResearchRelations = relations(Research, ({ many, one }) => ({
	userToStarredResearches: many(UserToStarredResearch),
	contributors: many(Contributor),
	independentVariable: one(IndependentVariable),
	blockingVariables: many(BlockingVariable),
	messagePrompts: many(MessagePrompt),
	evalPrompt: one(EvalPrompt),
	dependentValues: many(DependentValue),
	testBatches: many(TestBatch),
	researchResults: many(ResearchResult),
	forkedResearch: one(Research, {
		fields: [Research.forkedResearchId],
		references: [Research.id],
	}),
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

export const DependentValueRelations = relations(DependentValue, ({ one }) => ({
	research: one(Research, {
		fields: [DependentValue.researchId],
		references: [Research.id],
	}),
}))

export const TestBatchRelations = relations(TestBatch, ({ one, many }) => ({
	research: one(Research, {
		fields: [TestBatch.researchId],
		references: [Research.id],
	}),
	contributor: one(Contributor, {
		fields: [TestBatch.contributorId],
		references: [Contributor.id],
	}),
	testModelBatches: many(TestModelBatch),
	testBatchResults: many(TestBatchResult),
}))

export const TestModelBatchRelations = relations(TestModelBatch, ({ one, many }) => ({
	testBatch: one(TestBatch, {
		fields: [TestModelBatch.testBatchId],
		references: [TestBatch.id],
	}),
	tests: many(Test),
	testModelBatchResults: many(TestModelBatchResult),
}))

export const TestRelations = relations(Test, ({ one, many }) => ({
	testModelBatch: one(TestModelBatch, {
		fields: [Test.testModelBatchId],
		references: [TestModelBatch.id],
	}),
	independentValue: one(IndependentValue, {
		fields: [Test.independentValueId],
		references: [IndependentValue.id],
	}),
	dependentValue: one(DependentValue, {
		fields: [Test.dependentValueId],
		references: [DependentValue.id],
	}),
	testToBlockingValues: many(TestToBlockingValue),
	messages: many(Message),
	evals: many(Eval),
}))

export const TestToBlockingValueRelations = relations(TestToBlockingValue, ({ one }) => ({
	test: one(Test, {
		fields: [TestToBlockingValue.testId],
		references: [Test.id],
	}),
	blockingValue: one(BlockingValue, {
		fields: [TestToBlockingValue.blockingValueId],
		references: [BlockingValue.id],
	}),
}))

export const MessageRelations = relations(Message, ({ one }) => ({
	test: one(Test, {
		fields: [Message.testId],
		references: [Test.id],
	}),
}))

export const EvalRelations = relations(Eval, ({ one }) => ({
	test: one(Test, {
		fields: [Eval.testId],
		references: [Test.id],
	}),
}))

export const ResearchResultRelations = relations(ResearchResult, ({ one }) => ({
	research: one(Research, {
		fields: [ResearchResult.researchId],
		references: [Research.id],
	}),
	dependentValue: one(DependentValue, {
		fields: [ResearchResult.dependentValueId],
		references: [DependentValue.id],
	}),
}))

export const TestBatchResultRelations = relations(TestBatchResult, ({ one }) => ({
	testBatch: one(TestBatch, {
		fields: [TestBatchResult.testBatchId],
		references: [TestBatch.id],
	}),
	dependentValue: one(DependentValue, {
		fields: [TestBatchResult.dependentValueId],
		references: [DependentValue.id],
	}),
}))

export const TestModelBatchResultRelations = relations(TestModelBatchResult, ({ one }) => ({
	testModelBatch: one(TestModelBatch, {
		fields: [TestModelBatchResult.testModelBatchId],
		references: [TestModelBatch.id],
	}),
	dependentValue: one(DependentValue, {
		fields: [TestModelBatchResult.dependentValueId],
		references: [DependentValue.id],
	}),
}))

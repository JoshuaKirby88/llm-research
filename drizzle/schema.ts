import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const Research = pgTable("Research", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	name: text().notNull(),
	isCompleted: boolean().default(false),
	userId: text().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const Contributor = pgTable("Contributor", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	count: integer().notNull(),
	userId: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const IndependentVariable = pgTable("IndependentVariable", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	name: text().notNull(),
	prompt: text(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const IndependentValue = pgTable("IndependentValue", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	value: text().notNull(),
	independentVariableId: integer()
		.notNull()
		.references(() => IndependentVariable.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const BlockingVariable = pgTable("BlockingVariable", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	name: text().notNull(),
	prompt: text(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const BlockingValue = pgTable("BlockingValue", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	value: text().notNull(),
	blockingVariableId: integer()
		.notNull()
		.references(() => BlockingVariable.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const MessagePrompt = pgTable("MessagePrompt", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	role: text({ enum: ["system", "user", "assistant"] }).notNull(),
	text: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const EvalPrompt = pgTable("EvalPrompt", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	text: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const ResultEnum = pgTable("ResultEnum", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	value: text().notNull(),
	researchId: integer()
		.notNull()
		.references(() => Research.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const TestBatch = pgTable("TestBatch", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	count: integer().notNull(),
	contributorId: integer()
		.notNull()
		.references(() => Contributor.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const Test = pgTable("Test", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	resultEnumId: integer()
		.notNull()
		.references(() => ResultEnum.id),
	testBatchId: integer()
		.notNull()
		.references(() => TestBatch.id),
	independentValueId: integer()
		.notNull()
		.references(() => IndependentValue.id),
	blockingValueIds: integer().array().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const Message = pgTable("Message", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	role: text({ enum: ["system", "user", "assistant"] }).notNull(),
	content: text().notNull(),
	tokens: integer().notNull(),
	testId: integer()
		.notNull()
		.references(() => Test.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const Completion = pgTable("Completion", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	content: text().notNull(),
	tokens: integer().notNull(),
	testId: integer()
		.notNull()
		.references(() => Test.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const ResearchResult = pgTable("ResearchResult", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	count: integer().notNull(),
	resultEnumId: integer()
		.notNull()
		.references(() => ResultEnum.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

export const TestBatchResult = pgTable("TestBatchResult", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ minValue: 1000 }),
	count: integer().notNull(),
	resultEnumId: integer()
		.notNull()
		.references(() => ResultEnum.id),
	testBatchId: integer()
		.notNull()
		.references(() => TestBatch.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
})

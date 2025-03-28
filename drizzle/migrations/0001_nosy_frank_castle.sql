CREATE TABLE "BlockingValue" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "BlockingValue_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"value" text NOT NULL,
	"blockingVariableId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "BlockingVariable" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "BlockingVariable_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"name" text NOT NULL,
	"prompt" text,
	"researchId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Completion" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Completion_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"content" text NOT NULL,
	"tokens" integer NOT NULL,
	"testId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Contributor" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Contributor_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"count" integer NOT NULL,
	"userId" text NOT NULL,
	"researchId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "EvalPrompt" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "EvalPrompt_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"text" text NOT NULL,
	"researchId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "IndependentValue" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "IndependentValue_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"value" text NOT NULL,
	"independentVariableId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "IndependentVariable" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "IndependentVariable_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"name" text NOT NULL,
	"prompt" text,
	"researchId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Message" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Message_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"role" text NOT NULL,
	"content" text NOT NULL,
	"tokens" integer NOT NULL,
	"testId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "MessagePrompt" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "MessagePrompt_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"role" text NOT NULL,
	"text" text NOT NULL,
	"researchId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Research" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Research_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"name" text NOT NULL,
	"isCompleted" boolean DEFAULT false,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ResearchResult" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ResearchResult_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"count" integer NOT NULL,
	"resultEnumId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ResultEnum" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ResultEnum_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"value" text NOT NULL,
	"researchId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Test" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Test_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"resultEnumId" integer NOT NULL,
	"testBatchId" integer NOT NULL,
	"independentValueId" integer NOT NULL,
	"blockingValueIds" integer[] NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TestBatch" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "TestBatch_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"count" integer NOT NULL,
	"contributorId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TestBatchResult" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "TestBatchResult_id_seq" INCREMENT BY 1 MINVALUE 1000 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"count" integer NOT NULL,
	"resultEnumId" integer NOT NULL,
	"testBatchId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "User" CASCADE;--> statement-breakpoint
ALTER TABLE "BlockingValue" ADD CONSTRAINT "BlockingValue_blockingVariableId_BlockingVariable_id_fk" FOREIGN KEY ("blockingVariableId") REFERENCES "public"."BlockingVariable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BlockingVariable" ADD CONSTRAINT "BlockingVariable_researchId_Research_id_fk" FOREIGN KEY ("researchId") REFERENCES "public"."Research"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Completion" ADD CONSTRAINT "Completion_testId_Test_id_fk" FOREIGN KEY ("testId") REFERENCES "public"."Test"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Contributor" ADD CONSTRAINT "Contributor_researchId_Research_id_fk" FOREIGN KEY ("researchId") REFERENCES "public"."Research"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EvalPrompt" ADD CONSTRAINT "EvalPrompt_researchId_Research_id_fk" FOREIGN KEY ("researchId") REFERENCES "public"."Research"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "IndependentValue" ADD CONSTRAINT "IndependentValue_independentVariableId_IndependentVariable_id_fk" FOREIGN KEY ("independentVariableId") REFERENCES "public"."IndependentVariable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "IndependentVariable" ADD CONSTRAINT "IndependentVariable_researchId_Research_id_fk" FOREIGN KEY ("researchId") REFERENCES "public"."Research"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "Message_testId_Test_id_fk" FOREIGN KEY ("testId") REFERENCES "public"."Test"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "MessagePrompt" ADD CONSTRAINT "MessagePrompt_researchId_Research_id_fk" FOREIGN KEY ("researchId") REFERENCES "public"."Research"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ResearchResult" ADD CONSTRAINT "ResearchResult_resultEnumId_ResultEnum_id_fk" FOREIGN KEY ("resultEnumId") REFERENCES "public"."ResultEnum"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ResultEnum" ADD CONSTRAINT "ResultEnum_researchId_Research_id_fk" FOREIGN KEY ("researchId") REFERENCES "public"."Research"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Test" ADD CONSTRAINT "Test_resultEnumId_ResultEnum_id_fk" FOREIGN KEY ("resultEnumId") REFERENCES "public"."ResultEnum"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Test" ADD CONSTRAINT "Test_testBatchId_TestBatch_id_fk" FOREIGN KEY ("testBatchId") REFERENCES "public"."TestBatch"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Test" ADD CONSTRAINT "Test_independentValueId_IndependentValue_id_fk" FOREIGN KEY ("independentValueId") REFERENCES "public"."IndependentValue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TestBatch" ADD CONSTRAINT "TestBatch_contributorId_Contributor_id_fk" FOREIGN KEY ("contributorId") REFERENCES "public"."Contributor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TestBatchResult" ADD CONSTRAINT "TestBatchResult_resultEnumId_ResultEnum_id_fk" FOREIGN KEY ("resultEnumId") REFERENCES "public"."ResultEnum"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TestBatchResult" ADD CONSTRAINT "TestBatchResult_testBatchId_TestBatch_id_fk" FOREIGN KEY ("testBatchId") REFERENCES "public"."TestBatch"("id") ON DELETE no action ON UPDATE no action;
CREATE TABLE "User" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "User_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

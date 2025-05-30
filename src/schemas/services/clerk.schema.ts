import { AuthProcedureO } from "@/src/services/auth-procedure.service"
import { User } from "@clerk/nextjs/server"
import { z } from "zod"

export type ClerkPublicUser = AuthProcedureO<"public">
export type ClerkUser = AuthProcedureO<"signedIn">
export type ClerkQueriedUser = Omit<User, "privateMetadata" | "publicMetadata" | "unsafeMetadata"> & { metadata: ClerkMetadata }

export const clerkMetadataSchema = z.object({ bio: z.string().optional() })

export type ClerkMetadata = z.infer<typeof clerkMetadataSchema>

import crypto from "crypto"
import { env } from "@/utils/env"

export class CryptoService {
	private static algorithm = "aes-256-gcm"
	private static ivLength = 16

	static encrypt(text: string) {
		const iv = crypto.randomBytes(this.ivLength)
		const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(env.CRYPTO_KEY, "hex"), iv) as crypto.CipherGCM
		let encrypted = cipher.update(text, "utf8", "hex")
		encrypted += cipher.final("hex")
		const authTag = cipher.getAuthTag().toString("hex")
		return `${iv.toString("hex")}:${authTag}:${encrypted}`
	}

	static decrypt(data: string) {
		const [ivHex, authTagHex, encryptedText] = data.split(":")
		const iv = Buffer.from(ivHex, "hex")
		const authTag = Buffer.from(authTagHex, "hex")
		const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(env.CRYPTO_KEY, "hex"), iv) as crypto.DecipherGCM
		decipher.setAuthTag(authTag)
		let decrypted = decipher.update(encryptedText, "hex", "utf8")
		decrypted += decipher.final("utf8")
		return decrypted
	}
}

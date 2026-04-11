import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
dotenv.config({ path: path.resolve(currentDirPath, ".env") });

const connectionString =
	process.env.POOLED_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error(
		"DATABASE_URL is not set. Add it to backend/packages/shared/.env"
	);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

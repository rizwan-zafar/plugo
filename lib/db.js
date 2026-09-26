import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function mysqlConfigFromUrl(raw) {
  const url = new URL(raw);
  const database = decodeURIComponent(url.pathname.replace(/^\//, "")).split("?")[0];

  return {
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    connectionLimit: 5,
    connectTimeout: 5_000,
  };
}

function createPrisma() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is required (use 127.0.0.1, not localhost).");
  }

  const adapter = new PrismaMariaDb(mysqlConfigFromUrl(raw));
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma || createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

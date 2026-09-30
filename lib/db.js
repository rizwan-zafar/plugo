import { existsSync } from "fs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

function parseDatabaseUrl(raw) {
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }

  const url = new URL(raw.replace(/^mysql:\/\//i, "http://"));
  const database = decodeURIComponent(url.pathname.replace(/^\//, "").split("/")[0] || "");

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
  };
}

function localMysqlSocket(host) {
  if (!["127.0.0.1", "localhost", "::1"].includes(host)) return undefined;
  const candidates = [
    process.env.MYSQL_SOCKET,
    "/tmp/mysql.sock",
    "/var/lib/mysql/mysql.sock",
    "/var/run/mysqld/mysqld.sock",
    "/run/mysqld/mysqld.sock",
  ].filter(Boolean);
  return candidates.find((path) => existsSync(path));
}

function createPrismaClient() {
  const { host, port, user, password, database } = parseDatabaseUrl(process.env.DATABASE_URL);
  const socketPath = localMysqlSocket(host);
  const adapter = new PrismaMariaDb({
    ...(socketPath ? { socketPath } : { host, port }),
    user,
    password,
    database,
    connectionLimit: 5,
    connectTimeout: 15000,
    acquireTimeout: 15000,
    allowPublicKeyRetrieval: true,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

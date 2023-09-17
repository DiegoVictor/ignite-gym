import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

function generateDatabaseUrl(schema) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable should at least has an initial value'
    );
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schema);

  return url.toString();
}

export default {
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync(`npx prisma migrate deploy`);

    return {
      async teardown() {
        const prisma = new PrismaClient();
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`
        );
        await prisma.$disconnect();
      },
    };
  },
};

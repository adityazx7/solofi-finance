import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const dbUrl = process.env.DATABASE_URL || 'file:solofi.db';

export const rawClient = createClient({
  url: dbUrl,
});

export const db = drizzle(rawClient, { schema });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon("postgresql://neondb_owner:npg_U6E9iPhKLbrj@ep-plain-tooth-a4ulrbbu-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require");
export const db = drizzle(sql, { schema });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as dotenv from "dotenv";
import * as schema from "./schema";
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log("🔴 no database URL");
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
// const client = postgres(process.env.DATABASE_URL!,{

// });
const db = drizzle(pool, { schema });

export default db;

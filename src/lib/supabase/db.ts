import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "./schema";
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log("🔴 no database URL");
}

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client, schema });

export default db;

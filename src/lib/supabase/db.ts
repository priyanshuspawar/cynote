// import {drizzle,PostgresJsDatabase} from "drizzle-orm/postgres-js"
import {drizzle as drizzlePool} from "drizzle-orm/node-postgres"
// import postgres from "postgres"
import {Pool} from "pg"
import * as dotenv from "dotenv"
import * as schema from "../../../migrations/schema"
// import { migrate } from "drizzle-orm/postgres-js/migrator"
dotenv.config({path:".env"})


if (!process.env.DATABASE_URL){
    console.log("🔴 no database URL")
}
// const connectionString = process.env.DATABASE_URL as string
const pool = new Pool({
    connectionString:`postgresql://postgres.govwklbidoldosqqvriv:${process.env.PW}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`
})
// const client = postgres(connectionString,{max:1,prepare:false});
// const drizzleClient = drizzle(client,{schema:schema})
const drizzleClient = drizzlePool(pool,{schema})
// declare global {
//     var database:PostgresJsDatabase<typeof schema>|undefined;
// }

const db = drizzleClient
export default db;

// const migrateDb = async()=>{
//     try {
//         console.log("🟠 Migrating Client");
//         await migrate(db,{migrationsFolder:"migrations"});
//         console.log("🟢 Successfully Migrated")
//     } catch (error) {
//         console.log("🔴 Error Migrating Client")
//     }
   
    
// }
// migrateDb()

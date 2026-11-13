import { readFileSync } from "fs";
import { join } from "path";
import { Client } from "../node_modules/@types/pg";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  await client.connect();
  const files = ["0000_initial.sql", "0001_full_schema.sql"];
  for (const file of files) {
    console.log(`Running ${file}...`);
    const sql = readFileSync(
      join(__dirname, "../drizzle/migrations", file),
      "utf8",
    );
    await client.query(sql);
    console.log(`✓ ${file}`);
  }
  await client.end();
  console.log("Migration complete.");
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});

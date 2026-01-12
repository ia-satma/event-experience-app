import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgresql://neondb_owner:npg_U6E9iPhKLbrj@ep-plain-tooth-a4ulrbbu-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
    },
});

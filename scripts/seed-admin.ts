import { db } from "../src/lib/db";
import { users } from "../src/lib/schema";
import { eq } from "drizzle-orm";

async function seed() {
    console.log("Seeding admin user...");

    const email = "admin@congreso.com";

    const existing = await db.select().from(users).where(eq(users.email, email));

    if (existing.length === 0) {
        await db.insert(users).values({
            email,
            name: "Admin Congreso",
        });
        console.log("Admin user seeded successfully.");
    } else {
        console.log("Admin user already exists.");
    }
}

seed().catch(console.error);

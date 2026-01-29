/**
 * Temporary script to seed ProgramTag table with master data
 *
 * Run this script with: npx tsx app/scripts/seed-program-tags.ts
 * or: ts-node app/scripts/seed-program-tags.ts
 */

import { primaryDB } from "@/modules/common/database/prisma/connection";

const PROGRAM_TAGS = [
  "Digital",
  "Management",
  "Entrepreneurship",
  "Finance",
  "HR",
  "Technology",
  "Leadership",
  "Mini-MBA",
];

export async function seedProgramTags() {
  console.log("Starting ProgramTag seeding...");

  try {
    for (const tagName of PROGRAM_TAGS) {
      // Use upsert to avoid duplicates
      await primaryDB.programTag.upsert({
        where: { name: tagName },
        update: {
          // If tag exists, just update the timestamp
          updated_at: new Date(),
        },
        create: {
          name: tagName,
        },
      });
      console.log(`✓ Seeded/Updated tag: ${tagName}`);
    }

    console.log("\n✅ ProgramTag seeding completed successfully!");
    console.log(`Total tags processed: ${PROGRAM_TAGS.length}`);
  } catch (error) {
    console.error("❌ Error seeding ProgramTags:", error);
    throw error;
  } finally {
    await primaryDB.$disconnect();
  }
}

// Run the seed function
seedProgramTags()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });

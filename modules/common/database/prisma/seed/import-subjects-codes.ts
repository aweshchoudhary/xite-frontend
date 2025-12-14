import { primaryDB } from "../..";
import subjectsData from "./subjects-data.json";
import facultyCodesData from "./faculty-codes.json";

async function importSubjects() {
  try {
    console.log("Importing subjects...");
    const subjects = subjectsData;

    for (const subject of subjects) {
      const subjectArea = await primaryDB.facultySubjectArea.upsert({
        where: {
          name: subject.name,
        },
        update: {
          name: subject.name,
        },
        create: {
          name: subject.name,
        },
      });

      for (const item of subject.items) {
        await primaryDB.facultySubSubjectArea.upsert({
          where: {
            name: item,
          },
          update: {
            name: item,
            subject_area_id: subjectArea.id,
          },
          create: {
            name: item,
            subject_area_id: subjectArea.id,
          },
        });
      }
    }
    console.log("Subjects imported successfully");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function importFacultyCodes() {
  try {
    console.log("Importing faculty codes...");
    const facultyCodes = facultyCodesData;
    for (const facultyCode of facultyCodes) {
      await primaryDB.facultyCode.upsert({
        where: {
          name: facultyCode,
        },
        update: {
          name: facultyCode,
        },
        create: {
          name: facultyCode,
        },
      });
    }
    console.log("Faculty codes imported successfully");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function main() {
  await importSubjects();
  await importFacultyCodes();
}

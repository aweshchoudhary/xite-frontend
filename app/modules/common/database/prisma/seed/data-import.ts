"use server";
import academicPartnersData from "./data-academic-partners.json";
import facultyData from "./data-faculty.json";
import programsData from "./data-programs.json";
import cohortsData from "./data-cohorts.json";
import { primaryDB } from "../connection";
import { ProgramStatus, ProgramType, WorkStatus } from "../generated/prisma";
import { main as importSubjectsCodes } from "./import-subjects-codes";
// currency json
import currencyData from "@/modules/common/lib/currencies.json";
import { uploadFile } from "@/modules/common/services/file-upload";

const academicPartners = academicPartnersData;
const facultyList = facultyData;
const programsList = programsData;
const cohortsList = cohortsData;

const parseDate = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

export async function importAcademicPartners() {
  console.log(`Importing ${academicPartners.length} academic partners...`);
  await primaryDB.academicPartner.createMany({
    data: academicPartners.map((partner) => ({
      name: partner.Name?.trim() || "Unknown",
      display_name: partner["Display Name"]?.trim() || "",
      address: partner.Address?.trim() || "",
    })),
    skipDuplicates: true,
  });
}

export async function importFaculty() {
  console.log(`Importing ${facultyList.length} faculty members...`);
  const partners = await primaryDB.academicPartner.findMany();
  const facultyCodes = await primaryDB.facultyCode.findMany();

  // download the image from the url
  const downloadImage = async (
    url: string,
    fileName = "image.png"
  ): Promise<File> => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    const dataBlob = await response.blob();

    // Use the provided fileName or fallback to "image.png"
    return new File([dataBlob], fileName, {
      type: dataBlob.type || "image/png",
    });
  };

  for (const fac of facultyList) {
    const isFacultyExists = await primaryDB.faculty.findFirst({
      where: {
        name: fac.Name?.trim() || "Unknown",
        preferred_name: fac["Preferred name"]?.trim() || "",
      },
    });

    if (isFacultyExists) {
      return;
    }

    const image = await downloadImage(fac["Profile Image"]);
    const { fileUrl: imageUrl } = await uploadFile(image);
    const partner = partners.find(
      (p) => p.display_name === fac["Academic Partner"]
    );

    await primaryDB.faculty.create({
      data: {
        name: fac.Name?.trim() || "Unknown",
        preferred_name: fac["Preferred name"]?.trim() || "",
        title: fac.Title?.trim() || "",
        description: fac.Description || "",
        profile_image: imageUrl || "",
        email: "no@email.com",
        phone: "919999999999",
        note: fac.Note || "",
        academic_partner_id: partner?.id || undefined,
        faculty_code_id: facultyCodes[0]?.id || "",
      },
    });
  }
}

export async function importPrograms() {
  console.log(`Importing ${programsList.length} programs...`);
  const partners = await primaryDB.academicPartner.findMany();
  await primaryDB.program.createMany({
    data: programsList.map((program) => {
      const partner = partners.find(
        (p) => p.display_name === program["Academic Partner Key"]
      );
      return {
        name: program.Name?.trim() || "Unnamed Program",
        description: program.Overview || "",
        program_key: program["Program Key"] || "",
        academic_partner_id: partner?.id || "",
        type: ProgramType.OPEN,
        status: ProgramStatus.ACTIVE,
      };
    }),
    skipDuplicates: true,
  });
}

export async function importCohorts() {
  console.log(`Importing ${cohortsList.length} cohorts...`);
  const programRecords = await primaryDB.program.findMany();
  const facultyRecords = await primaryDB.faculty.findMany({
    include: {
      academic_partner: true,
    },
  });
  const getProgramByKey = (key: string) =>
    programRecords.find((p) => p.program_key === key);

  for (const cohort of cohortsData) {
    // Find faculty members (non-XED)
    const facultyConnections = cohort["Faculty"]
      .split(",")
      .map((faculty) => {
        const foundFaculty = facultyRecords.find(
          (f) =>
            f.name === faculty.trim() &&
            f.academic_partner?.display_name !== "XED"
        );
        return foundFaculty ? { id: foundFaculty.id } : null;
      })
      .filter((item): item is { id: string } => item !== null); // Remove null values with type assertion

    // Find industry experts (XED faculty)
    const industryExpertConnections = cohort["Faculty"]
      .split(",")
      .map((faculty) => {
        const foundFaculty = facultyRecords.find(
          (f) =>
            f.name === faculty.trim() &&
            f.academic_partner?.display_name === "XED"
        );
        return foundFaculty ? { id: foundFaculty.id } : null;
      })
      .filter((item): item is { id: string } => item !== null); // Remove null values with type assertion

    // Create faculty section (only if there are faculty to connect)
    const facultySection = await primaryDB.cohortFacultySection.create({
      data: {
        title: "Faculty",
        ...(facultyConnections.length > 0 && {
          items: {
            createMany: {
              data: facultyConnections.map((id, index) => ({
                position: index + 1,
                facultyId: id.id,
              })),
              skipDuplicates: true,
            },
          },
        }),
      },
    });

    // Create industry experts section (only if there are industry experts to connect)
    const industryExpertsSection =
      await primaryDB.cohortIndustryExpertsSection.create({
        data: {
          title: "Industry Experts",
          ...(industryExpertConnections.length > 0 && {
            items: {
              createMany: {
                data: industryExpertConnections.map((id, index) => ({
                  position: index + 1,
                  facultyId: id.id,
                })),
                skipDuplicates: true,
              },
            },
          }),
        },
      });

    const mediaSection = await primaryDB.cohortMediaSection.create({
      data: {
        title: "Media",
      },
    });

    const overviewSection = await primaryDB.cohortOverviewSection.create({
      data: {
        title: "Overview",
      },
    });

    const benefitsSection = await primaryDB.cohortBenefitsSection.create({
      data: {
        title: "Benefits",
      },
    });

    const whoShouldApplySection =
      await primaryDB.cohortWhoShouldApplySection.create({
        data: {
          title: "Who Should Apply",
        },
      });

    const curriculumSection = await primaryDB.cohortCurriculumSection.create({
      data: {
        title: "Curriculum",
      },
    });

    const statisticsSection = await primaryDB.cohortStatisticsSection.create({
      data: {
        title: "Statistics",
      },
    });

    const certificationSection =
      await primaryDB.cohortCertificationSection.create({
        data: {
          title: "Certification",
        },
      });

    const testimonialSection = await primaryDB.cohortTestimonialSection.create({
      data: {
        title: "Testimonials",
      },
    });

    const micrositeSection =
      await primaryDB.cohortSectionMicrositeSection.create({
        data: {
          title: "Microsite",
        },
      });

    // Create cohort with references to sections

    let currency = await primaryDB.currency.findUnique({
      where: {
        code: cohort["Fee (Currency Code)"] || "",
      },
    });

    if (!currency) {
      currency = await primaryDB.currency.create({
        data: {
          code: cohort["Fee (Currency Code)"] || "",
          name:
            currencyData.find(
              (currency) => currency.code === cohort["Fee (Currency Code)"]
            )?.name || "",
          symbol:
            currencyData.find(
              (currency) => currency.code === cohort["Fee (Currency Code)"]
            )?.symbol || "",
        },
      });
    }

    await primaryDB.cohort.create({
      data: {
        name:
          getProgramByKey(cohort["Program Key"])?.name +
            " - Cohort " +
            cohort["Cohort Num"] || "",
        description: "",
        program_id: getProgramByKey(cohort["Program Key"])?.id || "",
        status: WorkStatus.DRAFT,
        cohort_num: cohort["Cohort Num"],
        format: cohort["Format"],
        duration: cohort["Duration"],
        location: cohort["Location"],
        cohort_key:
          getProgramByKey(cohort["Program Key"])?.program_key +
          "-cohort-" +
          cohort["Cohort Num"],
        start_date: parseDate(cohort["Start Date"]),
        end_date: parseDate(cohort["End Date"]),
        max_cohort_size: cohort["Max Cohort Size"] || 0,
        media_section_id: mediaSection.id,
        overview_section_id: overviewSection.id,
        benefits_section_id: benefitsSection.id,
        curriculum_section_id: curriculumSection.id,
        statistics_section_id: statisticsSection.id,
        faculty_section_id: facultySection.id,
        industry_experts_section_id: industryExpertsSection.id,
        certification_section_id: certificationSection.id,
        testimonial_section_id: testimonialSection.id,
        who_should_apply_section_id: whoShouldApplySection.id,
        microsite_section_id: micrositeSection.id,
        fees: {
          create: [
            {
              amount: cohort["Fee (Amount)"] || 0,
              currency_id: currency.id,
            },
          ],
        },
      },
    });
  }
}

export async function main() {
  try {
    console.log("Starting data import process...");

    await importSubjectsCodes();
    console.log("✓ Subjects and faculty codes imported");

    await importAcademicPartners();
    console.log("✓ Academic partners imported");

    await importFaculty();
    console.log("✓ Faculty imported");

    await importPrograms();
    console.log("✓ Programs imported");

    await importCohorts();
    console.log("✓ Cohorts imported");

    console.log("Data import completed successfully!");
  } catch (error) {
    console.error("Error during data import:", error);
  }
}

main();

"use server";
import { primaryDB } from "../database/prisma/connection";

type ReadProps = {
  query: string;
};

export async function globalSearchRead({ query }: ReadProps) {
  try {
    const programData = await primaryDB.program.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            program_key: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        program_key: true,
      },
      take: 5,
    });

    const cohortsData = await primaryDB.cohort.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            fees: {
              some: {
                currency: {
                  code: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        program: true,
        cohort_key: true,
      },
      take: 5,
    });

    const facultyData = await primaryDB.faculty.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            academic_partner: {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        title: true,
      },
      take: 5,
    });

    const academicPartnerData = await primaryDB.academicPartner.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            display_name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        display_name: true,
      },
      take: 5,
    });

    const allData = [
      {
        type: "program",
        link: "/programs",
        data: programData.map((program) => ({
          id: program.id,
          name: program.name,
          description: program.program_key + "  " + program.description,
        })),
      },
      {
        type: "cohort",
        link: "/cohorts",
        data: cohortsData.map((cohort) => ({
          id: cohort.id,
          name: cohort.name,
          description: cohort.cohort_key + "  " + cohort.description,
        })),
      },
      {
        type: "faculty",
        link: "/faculty",
        data: facultyData.map((faculty) => ({
          id: faculty.id,
          name: faculty.name,
          description:
            faculty.email + "  " + faculty.phone + "  " + faculty.title,
        })),
      },
      {
        type: "academicPartner",
        link: "/academic-partners",
        data: academicPartnerData.map((partner) => ({
          id: partner.id,
          name: partner.name,
          description:
            partner.display_name + "  " + (partner.description || ""),
        })),
      },
    ];

    return allData;
  } catch (error) {
    throw error;
  }
}

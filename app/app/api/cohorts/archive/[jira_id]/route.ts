import { primaryDB } from "@/modules/common/database/prisma/connection";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jira_id: string }> }
) {
  try {
    const { jira_id } = await params;

    const cohort = await primaryDB.cohort.findFirst({
      where: {
        jira_id,
      },
    });

    if (!cohort) {
      throw new Error("Cohort not found");
    }

    const updatedCohort = await primaryDB.cohort.update({
      where: { id: cohort.id },
      data: {
        status: "ARCHIVED",
      },
    });

    return NextResponse.json({ data: updatedCohort }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

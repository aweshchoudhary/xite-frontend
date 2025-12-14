"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export type Subject = PrimaryDB.FacultySubjectAreaGetPayload<{
  include: {
    sub_subject_areas: true;
  };
}>;

export type SubSubjectArea = PrimaryDB.FacultySubSubjectAreaGetPayload<object>;

export const getSubjects = async (): Promise<Subject[]> => {
  const subjects = await primaryDB.facultySubjectArea.findMany({
    include: {
      sub_subject_areas: true,
    },
  });
  return subjects;
};
export const getSubSubjectAreas = async (): Promise<SubSubjectArea[]> => {
  const data = await primaryDB.facultySubSubjectArea.findMany({});
  return data;
};

export type FacultyCode = PrimaryDB.FacultyCodeGetPayload<object>;

export const getFacultyCodes = async (): Promise<FacultyCode[]> => {
  const data = await primaryDB.facultyCode.findMany({});
  return data;
};

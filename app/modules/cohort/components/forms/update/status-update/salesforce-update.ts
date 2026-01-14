import { primaryDB } from "@/modules/common/database/prisma/connection";
import {
  Cohort,
  Program,
} from "@/modules/common/database/prisma/generated/prisma";
import { createSalesforceInstance } from "@/modules/common/services/salesforce/connection";
import { Queue, Worker } from "bullmq";

export const queue = new Queue("salesforce-update");

export const worker = new Worker("salesforce-update", async (job) => {
  try {
    const { cohortId } = job.data;
    await main(cohortId);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export async function main(cohortId: string) {
  try {
    const cohort = await primaryDB.cohort.findUnique({
      where: { id: cohortId },
      include: {
        program: true,
      },
    });

    if (!cohort) {
      throw new Error("Cohort not found");
    }

    const programSF = await createSFProgram(cohort.program);
    await createSFCohort(cohort, cohort.program, programSF.id);
    await updateSFCohortNProgramID(cohort, cohort.program);
  } catch (error) {
    throw error;
  }
}

const createSFProgram = async (program: Program) => {
  try {
    const salesforce = await createSalesforceInstance();

    if (!salesforce) {
      throw new Error("Salesforce connection failed");
    }

    const programExists = await salesforce.sobject("Program__c").findOne({
      Program_ID__c: program.program_key,
    });

    if (programExists) {
      return programExists;
    }

    const createdProgram = await salesforce.sobject("Program__c").create({
      Name: program.name,
      Program__ID__c: program.program_key,
      Program_Short_Name__c: program.short_name,
    });

    return createdProgram;
  } catch (error) {
    throw error;
  }
};

const createSFCohort = async (
  cohort: Cohort,
  program: Program,
  programSfId: string
) => {
  try {
    const salesforce = await createSalesforceInstance();

    if (!salesforce) {
      throw new Error("Salesforce connection failed");
    }

    const cohortExists = await salesforce.sobject("Cohort__c").findOne({
      Cohort_ID__c: cohort.cohort_key,
    });

    if (cohortExists) {
      return cohortExists;
    }

    const createdCohort = await salesforce.sobject("Cohort__c").create({
      Name: cohort.name,
      Cohort_ID__c: cohort.cohort_key,
      Program__ID__c: program.program_key,
      Start_Date__c: cohort.start_date,
      Marketing_Start_Date__c: cohort.mkt_start_date,
      Marketing_End_Date__c: cohort.mkt_end_date,
      Program__c: programSfId,
    });

    return createdCohort;
  } catch (error) {
    throw error;
  }
};

export const updateSFCohortNProgramID = async (
  cohort: Cohort,
  program: Program
) => {
  try {
    const salesforce = await createSalesforceInstance();
    const leadCohortField = await salesforce?.metadata.read(
      "CustomField",
      "Lead.Cohort__c"
    );

    if (!leadCohortField) {
      throw new Error("Lead Stage field not found");
    }

    leadCohortField.valueSet?.valueSetDefinition?.value.push({
      fullName: cohort.cohort_key,
      default: false,
      label: `${program.short_name} - ${cohort.cohort_key}`,
      isActive: true,
    });

    await salesforce?.metadata.update("CustomField", leadCohortField);

    const leadProgramField = await salesforce?.metadata.read(
      "CustomField",
      "Lead.Program__c"
    );

    if (!leadProgramField) {
      throw new Error("Lead Program field not found");
    }

    leadProgramField.valueSet?.valueSetDefinition?.value.push({
      fullName: program.program_key,
      default: false,
      label: program.name,
    });

    await salesforce?.metadata.update("CustomField", leadProgramField);

    const opportunityCohortField = await salesforce?.metadata.read(
      "CustomField",
      "Opportunity.Cohort__c"
    );

    if (!opportunityCohortField) {
      throw new Error("Opportunity Cohort field not found");
    }

    opportunityCohortField.valueSet?.valueSetDefinition?.value.push({
      fullName: cohort.cohort_key,
      default: false,
      label: `${program.short_name} - ${cohort.cohort_key}`,
      isActive: true,
    });

    await salesforce?.metadata.update("CustomField", opportunityCohortField);

    const opportunityProgramField = await salesforce?.metadata.read(
      "CustomField",
      "Opportunity.Program__c"
    );

    if (!opportunityProgramField) {
      throw new Error("Opportunity Program field not found");
    }

    opportunityProgramField.valueSet?.valueSetDefinition?.value.push({
      fullName: program.program_key,
      default: false,
      label: program.name,
    });

    await salesforce?.metadata.update("CustomField", opportunityProgramField);
  } catch (error) {
    throw error;
  }
};

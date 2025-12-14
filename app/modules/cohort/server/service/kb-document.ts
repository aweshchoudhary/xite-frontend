"use server";
import { GetCohort, getLatestCohortByProgramId } from "../cohort/read";
import { jsonToPlainText } from "json-to-plain-text";
import { uploadFile } from "@/modules/common/services/file-system/controllers/upload";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import {
  createDocument,
  deleteDocument,
  getDocumentsByName,
  getPersonas,
  updatePersonaDocument,
} from "./tavus-apis";

type mainProps = {
  cohort: GetCohort;
};

const BUCKET_NAME = "xed-programs-kb-documents";

export async function main({ cohort }: mainProps) {
  try {
    const { data: latestCohort } = await getLatestCohortByProgramId({
      programId: cohort.program_id,
    });
    const textContent = jsonToPlainText(cohort, {
      doubleQuotesForKeys: true,
      doubleQuotesForValues: true,
      spacing: true,
    });

    if (latestCohort?.id !== cohort.id) {
      return;
    }

    const file = await createKBDocuments({
      textContent,
      cohortId: cohort.cohort_key,
    });

    // upload the kb document to the GCP bucket
    const { filename } = await uploadKBDocuments({
      file,
      cohortId: cohort.cohort_key,
    });

    // upload the kb document to the elevenlabs bucket
    await updateElevenLabsKBDocument({
      textContent,
      cohortId: cohort.cohort_key,
    });

    // update the kb document in tavus
    await updateTavusKBDocument({
      documentUrl: process.env.NEXTAUTH_URL + "/api/knowledge-base/" + filename,
      cohortId: cohort.cohort_key,
    });

    console.log("KB documents uploaded for cohort", cohort.cohort_key);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type CreateKBDocumentsProps = {
  textContent: string;
  cohortId: string;
};
export async function createKBDocuments({
  textContent,
  cohortId,
}: CreateKBDocumentsProps) {
  try {
    // create a file
    const file = new File([textContent], `${cohortId}-${Date.now()}.txt`, {
      type: "text/plain",
    });

    return file;
  } catch (error) {
    throw error;
  }
}

type UploadKBDocumentsProps = {
  file: File;
  cohortId: string;
};
export async function uploadKBDocuments({
  file,
  cohortId,
}: UploadKBDocumentsProps): Promise<{ filename: string; fileUrl: string }> {
  try {
    // upload the kb document to the s3 bucket
    return await uploadFile({
      file,
      bucketName: BUCKET_NAME,
      fileName: `${cohortId}-${Date.now()}.txt`,
      customMetadata: {
        cohortId: cohortId,
      },
    });
  } catch (error) {
    throw error;
  }
}

type UpdateElevenLabsKBDocumentProps = {
  cohortId: string;
  textContent: string;
};
export async function updateElevenLabsKBDocument({
  cohortId,
  textContent,
}: UpdateElevenLabsKBDocumentProps) {
  try {
    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const previousDocuments = await client.conversationalAi.knowledgeBase.list({
      search: `${cohortId}.txt`,
      sortBy: "updated_at",
    });

    const document = await uploadKBDocumentToElevenLabs({
      textContent,
      cohortId,
    });

    previousDocuments.documents.forEach(async (doc) => {
      const dependentAgents =
        await client.conversationalAi.knowledgeBase.documents.getAgents(doc.id);
      await Promise.all(
        dependentAgents.agents.map(async (agent) => {
          if (agent.type === "unknown") return;

          const agentDetails = await client.conversationalAi.agents.get(
            agent.id
          );

          const knowledgeBase =
            agentDetails.conversationConfig.agent?.prompt?.knowledgeBase?.filter(
              (doc) => doc.name !== document.name
            ) || [];

          await client.conversationalAi.agents.update(agent.id, {
            conversationConfig: {
              agent: {
                prompt: {
                  knowledgeBase: [
                    ...knowledgeBase?.map((doc) => ({
                      id: doc.id,
                      name: doc.name,
                      type: doc.type,
                    })),
                    {
                      id: document.id,
                      name: document.name,
                      type: "file",
                    },
                  ],
                },
              },
            },
          });
        })
      );

      await client.conversationalAi.knowledgeBase.documents.delete(doc.id);
    });
  } catch (error) {
    throw error;
  }
}

type UploadKBDocumentToElevenLabsProps = {
  textContent: string;
  cohortId: string;
};
export async function uploadKBDocumentToElevenLabs({
  textContent,
  cohortId,
}: UploadKBDocumentToElevenLabsProps) {
  try {
    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const document =
      await client.conversationalAi.knowledgeBase.documents.createFromText({
        text: textContent,
        name: `${cohortId}.txt`,
      });

    await client.conversationalAi.knowledgeBase.document.computeRagIndex(
      document.id,
      {
        model: "e5_mistral_7b_instruct",
      }
    );

    return document;
  } catch (error) {
    throw error;
  }
}

type UpdateTavusKBDocumentProps = {
  documentUrl: string;
  cohortId: string;
};
export async function updateTavusKBDocument({
  documentUrl,
  cohortId,
}: UpdateTavusKBDocumentProps) {
  try {
    const documents = await getDocumentsByName({
      documentName: `${cohortId}.txt`,
    });

    const document = await createDocument({
      documentUrl,
      documentName: `${cohortId}.txt`,
      tags: [`${cohortId}`],
    });

    const personas = await getPersonas({});

    const documentIds = documents.map((doc: any) => doc.document_id);

    personas.forEach(async (persona: any) => {
      // persona.document_ids is array of strings

      if (!persona.document_ids.includes(document.uuid)) return;

      await updatePersonaDocument({
        personaId: persona.persona_id,
        documentIdToAdd: document.uuid,
        documentIdToRemove: documentIds.join(","),
      });
    });

    documents.forEach(async (doc: any) => {
      await deleteDocument({
        documentId: doc.document_id,
      });
    });
  } catch (error) {
    throw error;
  }
}

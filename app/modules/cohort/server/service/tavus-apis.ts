const url = "https://tavusapi.com/v2";

type CreateDocumentProps = {
  documentUrl: string;
  documentName: string;
  callbackUrl?: string;
  properties?: Record<string, string>;
  tags: string[];
};
export async function createDocument({
  documentUrl,
  documentName,
  callbackUrl,
  properties,
  tags,
}: CreateDocumentProps) {
  try {
    const options = {
      method: "POST",
      headers: {
        "x-api-key": process.env.TAVUS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        document_url: documentUrl,
        document_name: documentName,
        callback_url: callbackUrl,
        properties: properties,
        tags: tags,
      }),
    };

    const response = await fetch(`${url}/documents`, options);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type GetDocumentsByNameProps = {
  documentName: string;
};
export async function getDocumentsByName({
  documentName,
}: GetDocumentsByNameProps) {
  try {
    const options = {
      method: "GET",
      headers: {
        "x-api-key": process.env.TAVUS_API_KEY!,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(
      `${url}/documents?name_or_uuid=${documentName}`,
      options
    );
    const { data } = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

type DeleteDocumentProps = {
  documentId: string;
};
export async function deleteDocument({ documentId }: DeleteDocumentProps) {
  try {
    const options = {
      method: "DELETE",
      headers: {
        "x-api-key": process.env.TAVUS_API_KEY!,
        "Content-Type": "application/json",
      },
    };

    await fetch(`${url}/documents/${documentId}`, options);
  } catch (error) {
    throw error;
  }
}

type UpdatePersonaDocumentProps = {
  personaId: string;
  documentIdToAdd: string;
  documentIdToRemove: string;
};
export async function updatePersonaDocument({
  personaId,
  documentIdToAdd,
  documentIdToRemove,
}: UpdatePersonaDocumentProps) {
  try {
    const options = {
      method: "PUT",
      headers: {
        "x-api-key": process.env.TAVUS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          op: "add",
          path: "/document_ids",
          value: documentIdToAdd,
        },
        {
          op: "remove",
          path: "/document_ids",
          value: documentIdToRemove,
        },
      ]),
    };

    const response = await fetch(`${url}/personas/${personaId}`, options);
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

type GetPersonasProps = {};
export async function getPersonas({}: GetPersonasProps) {
  try {
    const options = {
      method: "GET",
      headers: {
        "x-api-key": process.env.TAVUS_API_KEY!,
        "Content-Type": "application/json",
      },
      //   query params
      params: {
        persona_type: "user",
      },
    };

    const response = await fetch(`${url}/personas`, options);
    const { data } = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

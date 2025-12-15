"use server";
import { MicrositeModel } from "@/modules/microsite-cms/modules/common/services/db/models/microsite";
import { MicrositeSchema } from "./schema";
import connectDB from "@/modules/microsite-cms/modules/common/services/db/connection";
import { MicrositeFormInput } from "./schema";
import { TemplateModal } from "../../models/template";
import {
  ITemplateBlock,
  ITemplateSection,
  ITemplatePage,
  ITemplate,
} from "../../types/interfaces";
import { uploadFileAction } from "@/modules/microsite-cms/modules/common/services/file-system/upload-action";
import { writeFile } from "fs/promises";

interface UpdateMicrositeProps {
  micrositeId: string;
  templateId: string;
  fields: MicrositeFormInput;
}

export async function updateMicrosite({
  micrositeId,
  templateId,
  fields,
}: UpdateMicrositeProps) {
  await connectDB();

  const template = await TemplateModal.findById(templateId);

  if (!template) throw new Error("Template not found");

  let data = MicrositeSchema.parse({
    ...fields,
    micrositeId,
  });

  data = await uploadImages(data, template);
  await writeFile("microsite.json", JSON.stringify(data, null, 2));

  const microsite = await MicrositeModel.findById(micrositeId);
  if (!microsite) throw new Error("Microsite not found");

  microsite.title = data.title || "Page";
  microsite.status = data.status ?? "draft";

  microsite.globalSections = data.globalSections;
  microsite.pages = data.pages;

  await microsite.save();

  return JSON.parse(JSON.stringify(microsite));
}

const uploadImages = async (
  data: MicrositeFormInput,
  template: ITemplate
): Promise<MicrositeFormInput> => {
  try {
    // Helper function to upload file if it's a File object
    const uploadFileIfNeeded = async (
      value: unknown
    ): Promise<string | unknown> => {
      if (value instanceof File) {
        const fileUrl = await uploadFileAction(value);
        return fileUrl;
      }
      return value;
    };

    // Process blocks from global sections
    for (const section of data.globalSections) {
      const templateSection = template.globalSections.find(
        (s: ITemplateSection) => s.key === section.key
      );

      for (const block of section.blocks) {
        const templateBlock = templateSection?.blocks.find(
          (b: ITemplateBlock) => b.key === block.key
        );

        if (!templateBlock) continue;

        // Handle non-repeatable blocks (single or group)
        if (block.value && !block.repeatable) {
          for (const element of templateBlock.elements) {
            if (
              element.type === "image" ||
              element.type === "video" ||
              element.type === "file"
            ) {
              const elementValue = block.value[element.key];
              if (elementValue) {
                block.value[element.key] = await uploadFileIfNeeded(
                  elementValue
                );
              }
            }
          }
        }

        // Handle repeatable blocks (items)
        if (block.items && block.repeatable) {
          for (const item of block.items) {
            for (const element of templateBlock.elements) {
              if (element.type === "image" || element.type === "file") {
                const elementValue = item?.data?.[element.key];
                if (elementValue) {
                  item.data[element.key] = await uploadFileIfNeeded(
                    elementValue
                  );
                }
              }
            }
          }
        }
      }
    }

    // Process blocks from pages
    for (const page of data.pages) {
      const templatePage = template.pages.find(
        (p: ITemplatePage) => p.slug === page.meta.slug
      );

      for (const section of page.sections) {
        const templateSection = templatePage?.sections.find(
          (s: ITemplateSection) => s.key === section.key
        );

        for (const block of section.blocks) {
          const templateBlock = templateSection?.blocks.find(
            (b: ITemplateBlock) => b.key === block.key
          );

          if (!templateBlock) continue;

          // Handle non-repeatable blocks (single or group)
          if (block.value && !block.repeatable) {
            for (const element of templateBlock.elements) {
              if (
                element.type === "image" ||
                element.type === "video" ||
                element.type === "file"
              ) {
                const elementValue = block.value[element.key];
                if (elementValue) {
                  block.value[element.key] = await uploadFileIfNeeded(
                    elementValue
                  );
                }
              }
            }
          }

          // Handle repeatable blocks (items)
          if (block.items && block.repeatable) {
            for (const item of block.items) {
              for (const element of templateBlock.elements) {
                if (
                  element.type === "image" ||
                  element.type === "video" ||
                  element.type === "file"
                ) {
                  const elementValue = item.data[element.key];
                  if (elementValue) {
                    item.data[element.key] = await uploadFileIfNeeded(
                      elementValue
                    );
                  }
                }
              }
            }
          }
        }
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
};

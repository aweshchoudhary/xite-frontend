"use server";

import { TemplateModal } from "@microsite-cms/common/services/db/models/template";
import connectDB from "@microsite-cms/common/services/db/connection";
import {
  ISectionValue,
  ITemplate,
  ITemplateBlock,
  ITemplateSection,
  IMicrosite,
  IBlockValue,
} from "@microsite-cms/common/services/db/types/interfaces";
import { MicrositeModel } from "../..";

export async function updateTemplate(id: string, data: Partial<ITemplate>) {
  await connectDB();

  const oldTemplate = (await TemplateModal.findById(id)) as ITemplate | null;
  if (!oldTemplate) throw new Error("Template not found");

  const updated = await TemplateModal.findByIdAndUpdate(id, data, {
    new: true,
  });

  const newTemplate = updated as ITemplate;

  const microsites = (await MicrositeModel.find({
    templateId: id,
  })) as IMicrosite[];

  for (const microsite of microsites) {
    await syncMicrositeWithTemplate(microsite, oldTemplate, newTemplate);
  }

  return JSON.parse(JSON.stringify(updated)) as ITemplate;
}

function syncMicrositeWithTemplate(
  microsite: IMicrosite,
  oldTemplate: ITemplate,
  newTemplate: ITemplate
) {
  microsite.globalSections = syncSections(
    oldTemplate.globalSections,
    newTemplate.globalSections,
    microsite.globalSections
  );

  const oldPagesMap = new Map(oldTemplate.pages.map((p) => [p.slug, p]));
  const micrositePagesMap = new Map(
    microsite.pages.map((p) => [p.meta.slug, p])
  );

  microsite.pages = newTemplate.pages.map((newPage) => {
    const oldPage = oldPagesMap.get(newPage.slug);
    const micrositePage = micrositePagesMap.get(newPage.slug);

    if (!micrositePage) {
      return {
        name: newPage.title,
        meta: {
          title: newPage.title,
          description: "",
          slug: newPage.slug,
        },
        sections: syncSections(oldPage?.sections || [], newPage.sections, []),
      };
    }

    return {
      ...micrositePage,
      sections: syncSections(
        oldPage?.sections || [],
        newPage.sections,
        micrositePage.sections
      ),
    };
  });

  return microsite.save();
}

function syncSections(
  oldSections: ITemplateSection[],
  newSections: ITemplateSection[],
  currentSectionValues: ISectionValue[]
): ISectionValue[] {
  const oldSectionsMap = new Map(oldSections.map((s) => [s.key, s]));
  const currentSectionsMap = new Map(
    currentSectionValues.map((s) => [s.key, s])
  );

  return newSections.map((newSection) => {
    const oldSection = oldSectionsMap.get(newSection.key);
    const currentSection = currentSectionsMap.get(newSection.key);

    if (!currentSection) {
      return {
        key: newSection.key,
        branding: {},
        blocks: newSection.blocks.map((block) => createEmptyBlockValue(block)),
      };
    }

    return {
      ...currentSection,
      blocks: syncBlocks(
        oldSection?.blocks || [],
        newSection.blocks,
        currentSection.blocks
      ),
    };
  });
}

function syncBlocks(
  oldBlocks: ITemplateBlock[],
  newBlocks: ITemplateBlock[],
  currentBlockValues: IBlockValue[]
): IBlockValue[] {
  const oldBlocksMap = new Map(oldBlocks.map((b) => [b.key, b]));
  const currentBlocksMap = new Map(currentBlockValues.map((b) => [b.key, b]));

  return newBlocks.map((newBlock) => {
    const oldBlock = oldBlocksMap.get(newBlock.key);
    const currentBlock = currentBlocksMap.get(newBlock.key);

    if (!currentBlock) {
      return createEmptyBlockValue(newBlock);
    }

    if (!oldBlock || hasBlockConflict(oldBlock, newBlock)) {
      return createEmptyBlockValue(newBlock);
    }

    return {
      ...currentBlock,
      type: newBlock.type,
      repeatable: newBlock.repeatable,
      value: syncBlockValue(oldBlock, newBlock, currentBlock.value),
      items: syncBlockItems(oldBlock, newBlock, currentBlock.items || []),
    };
  });
}

function hasBlockConflict(
  oldBlock: ITemplateBlock,
  newBlock: ITemplateBlock
): boolean {
  if (oldBlock.type !== newBlock.type) return true;
  if (oldBlock.repeatable !== newBlock.repeatable) return true;

  const oldElementsMap = new Map(oldBlock.elements.map((e) => [e.key, e]));
  for (const newElement of newBlock.elements) {
    const oldElement = oldElementsMap.get(newElement.key);
    if (oldElement && oldElement.type !== newElement.type) {
      return true;
    }
  }

  return false;
}

function syncBlockValue(
  oldBlock: ITemplateBlock,
  newBlock: ITemplateBlock,
  currentValue: Record<string, unknown> | null | undefined
): Record<string, unknown> | null {
  if (!currentValue || newBlock.repeatable) return null;

  const oldElementsMap = new Map(oldBlock.elements.map((e) => [e.key, e]));

  const syncedValue: Record<string, unknown> = {};

  for (const newElement of newBlock.elements) {
    const oldElement = oldElementsMap.get(newElement.key);
    const currentElementValue = currentValue[newElement.key];

    if (!oldElement || oldElement.type !== newElement.type) {
      syncedValue[newElement.key] = null;
    } else if (currentElementValue !== undefined) {
      syncedValue[newElement.key] = currentElementValue;
    } else {
      syncedValue[newElement.key] = null;
    }
  }

  return syncedValue;
}

function syncBlockItems(
  oldBlock: ITemplateBlock,
  newBlock: ITemplateBlock,
  currentItems: Array<{ data: Record<string, unknown> }>
): Array<{ data: Record<string, unknown> }> {
  if (!newBlock.repeatable) return [];

  const oldElementsMap = new Map(oldBlock.elements.map((e) => [e.key, e]));

  return currentItems.map((item) => {
    const syncedData: Record<string, unknown> = {};

    for (const newElement of newBlock.elements) {
      const oldElement = oldElementsMap.get(newElement.key);
      const currentElementValue = item.data[newElement.key];

      if (!oldElement || oldElement.type !== newElement.type) {
        syncedData[newElement.key] = null;
      } else if (currentElementValue !== undefined) {
        syncedData[newElement.key] = currentElementValue;
      } else {
        syncedData[newElement.key] = null;
      }
    }

    return { data: syncedData };
  });
}

function createEmptyBlockValue(block: ITemplateBlock): IBlockValue {
  if (block.repeatable) {
    return {
      key: block.key,
      type: block.type,
      repeatable: true,
      value: null,
      items: [],
    };
  }

  const emptyValue: Record<string, unknown> = {};
  for (const element of block.elements) {
    emptyValue[element.key] = null;
  }

  return {
    key: block.key,
    type: block.type,
    repeatable: false,
    value: emptyValue,
    items: null,
  };
}

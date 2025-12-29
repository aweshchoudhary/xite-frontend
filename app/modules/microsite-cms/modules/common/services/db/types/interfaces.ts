export interface ITemplateElement {
  key: string;
  title: string;
  type: "text" | "textarea" | "richtext" | "image" | "file" | "video";
  required?: boolean;
  config?: Record<string, unknown>;
}

export interface ITemplateBlock {
  key: string;
  title: string;
  description?: string;

  elements: ITemplateElement[];

  repeatable: boolean;
  type: "group" | "single";
}

export interface ITemplateSection {
  key: string;
  title: string;
  blocks: ITemplateBlock[];
}

export interface ITemplatePage {
  title: string;
  slug: string;
  sections: ITemplateSection[];
}

export type TemplateType = "generic" | "program-specific";

export interface ITemplate {
  _id?: string;
  name: string;
  cohortId?: string | null;
  status?: "draft" | "active" | "archived";
  type?: TemplateType;
  description?: string;
  pages: ITemplatePage[];
  globalSections: ITemplateSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IBlockValueGroup {
  [elementKey: string]: unknown;
}

export interface IBlockValue {
  key: string;
  type: "single" | "group";
  repeatable: boolean;

  value?: IBlockValueGroup | null;
  items?: IBlockValueGroup[] | null;
}

export interface ISectionValue {
  key: string;
  blocks: IBlockValue[];
}

export interface IPageValue {
  name: string;
  meta: {
    title: string;
    description?: string;
    slug: string;
  };
  sections: ISectionValue[];
}

export interface IMicrositeBranding {
  logo: string;
  favicon: string;
  colors?: {
    primary: string;
    primary_foreground: string;
    secondary: string;
    secondary_foreground: string;
    accent: string;
    accent_foreground: string;
    border: string;
  };
  fonts: {
    family: string;
  };
}

export interface IMicrosite {
  _id?: string;

  domain?: string;

  templateId: string;
  cohortId: string;
  type: TemplateType;

  title: string;
  status: "draft" | "active" | "archived";

  globalSections: ISectionValue[];
  pages: IPageValue[];

  branding?: IMicrositeBranding;

  createdAt?: string;
  updatedAt?: string;
}

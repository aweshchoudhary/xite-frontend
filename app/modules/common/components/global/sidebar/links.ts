import {
  Book01Icon,
  TextAlignJustifyCenterFreeIcons,
  School01Icon,
  User02Icon,
  Building01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";
import { Resource } from "@/modules/common/authentication/access-control";
import { IconSvgElement } from "@hugeicons/react";

export type Link = {
  title: string;
  url: string;
  resource: Resource;
  icon: IconSvgElement;
  exact: boolean;
};

export const links: Link[] = [
  {
    title: "Dashboard",
    url: "/",
    resource: "Program",
    exact: true,
    icon: Book01Icon,
  },
  {
    title: "Programs",
    url: "/programs",
    resource: "Program",
    exact: false,
    icon: Book01Icon,
  },
  {
    title: "Cohorts",
    url: "/cohorts",
    resource: "Cohort",
    exact: false,
    icon: TextAlignJustifyCenterFreeIcons,
  },
  {
    title: "Academic Partners",
    url: "/academic-partners",
    resource: "AcademicPartners",
    exact: false,
    icon: School01Icon,
  },
  {
    title: "Faculty",
    url: "/faculty",
    resource: "Faculty",
    exact: false,
    icon: User02Icon,
  },
  {
    title: "Enterprises",
    url: "/enterprises",
    resource: "Enterprise",
    exact: false,
    icon: Building01Icon,
  },
  {
    title: "Microsites CMS",
    url: "/microsite-cms",
    resource: "Microsite",
    exact: false,
    icon: Globe02Icon,
  },
  {
    title: "T-ST Management",
    url: "/topics",
    resource: "Topic",
    exact: false,
    icon: TextAlignJustifyCenterFreeIcons,
  },
];

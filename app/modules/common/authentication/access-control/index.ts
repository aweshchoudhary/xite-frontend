export type Action = "read" | "write" | "update" | "delete";
export type Resource =
  | "Program"
  | "Cohort"
  | "Faculty"
  | "AcademicPartners"
  | "Enterprise"
  | "Microsite"
  | "Topic"
  | "Template";

export type Role = "Admin" | "User";

export type Permissions = Record<Role, Partial<Record<Resource, Action[]>>>;

export const permissions: Permissions = {
  Admin: {
    Program: ["read", "write", "update", "delete"],
    Cohort: ["read", "write", "update", "delete"],
    Faculty: ["read", "write", "update", "delete"],
    AcademicPartners: ["read", "write", "update", "delete"],
    Enterprise: ["read", "write", "update", "delete"],
    Microsite: ["read", "write", "update", "delete"],
    Topic: ["read", "write", "update", "delete"],
    Template: ["read", "write", "update", "delete"],
  },
  User: {
    Program: ["read", "write", "update"],
    Cohort: ["read", "write", "update"],
    Faculty: ["read", "write", "update"],
    AcademicPartners: ["read", "write", "update"],
    Enterprise: ["read", "write", "update"],
    Microsite: ["read", "write", "update"],
    Topic: ["read", "write", "update"],
    Template: ["read", "write", "update"],
  },
};

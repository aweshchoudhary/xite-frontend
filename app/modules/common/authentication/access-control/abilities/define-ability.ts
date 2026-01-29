import { AbilityBuilder, PureAbility } from "@casl/ability";
import { UserRole } from "@/modules/common/database/prisma/generated/prisma";

export type Action = "read" | "create" | "update" | "delete" | "manage";
export type Subject =
  | "Program"
  | "Cohort"
  | "Faculty"
  | "AcademicPartner"
  | "Enterprise"
  | "Microsite"
  | "Topic"
  | "Template"
  | "all";

export type AppAbility = PureAbility<[Action, Subject]>;

export function defineAbilityFor(roles: UserRole[], userId?: string) {
  const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

  const roleNames = roles.map((r) => r.role);

  if (roleNames.includes("Admin")) {
    // Admin can do everything
    can("manage", "all");
  } else if (roleNames.includes("User")) {
    // User permissions
    can(["read", "create", "update"], "Program");
    can(["read", "create", "update"], "Cohort");
    can(["read", "create", "update"], "Microsite");
    can("read", "Faculty");
    can("read", "AcademicPartner");
    can("read", "Enterprise");
    can("read", "Topic");
  }

  return build();
}

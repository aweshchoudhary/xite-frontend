// lib/stores/profileFormStore.ts
import { createFormState } from "@/modules/common/components/global/form/common-context";
import { ProgramCreateSchema } from "../schema";

export const useFormState = createFormState<ProgramCreateSchema>();

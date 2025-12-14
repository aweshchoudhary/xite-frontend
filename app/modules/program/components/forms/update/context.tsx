// lib/stores/profileFormStore.ts
import { createFormState } from "@/modules/common/components/global/form/common-context";
import { ProgramUpdateSchema } from "../schema";

export const useFormState = createFormState<ProgramUpdateSchema>();

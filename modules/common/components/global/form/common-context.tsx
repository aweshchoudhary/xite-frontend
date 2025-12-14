// lib/stores/createFormStore.ts
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { create } from "zustand";

type BaseFormStore<T> = {
  // Common UI states
  isModalOpen: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Form-specific state
  defaultValues: T;
  fieldValues: T;

  // Actions
  openModal: () => void;
  closeModal: () => void;
  setSubmitting: (is: boolean) => void;
  setError: (err: string | null) => void;
  setDefaultValues: (values: T) => void;
  setFieldValues: (values: T) => void;
  resetFormState: () => void;
  redirect: (router: AppRouterInstance, path?: string) => void;
};

// Factory function to create typed store
export function createFormState<T>(initialValues?: T) {
  return create<BaseFormStore<T>>((set) => ({
    isModalOpen: false,
    isSubmitting: false,
    error: null,
    defaultValues: initialValues || ({} as T),
    fieldValues: initialValues || ({} as T),

    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    setError: (error) => set({ error }),
    setDefaultValues: (defaultValues) => set({ defaultValues }),
    setFieldValues: (fieldValues) => set({ fieldValues }),
    resetFormState: () =>
      set({
        isModalOpen: false,
        isSubmitting: false,
        error: null,
        defaultValues: initialValues,
        fieldValues: initialValues,
      }),
    redirect: (router: AppRouterInstance, path?: string) => {
      if (path) {
        router.push(path);
      }
    },
  }));
}

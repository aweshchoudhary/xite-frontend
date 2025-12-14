export interface FormBaseProps<T> {
  defaultValues?: Partial<T>;
  onSuccess?: () => void;
  onCancel?: () => void;
  successRedirectPath?: string;
  cancelRedirectPath?: string;
}

export interface FormModalBaseProps<T> extends FormBaseProps<T> {
  trigger?: React.ReactNode;
  noTrigger?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export interface FormUpdateBaseProps<T> extends FormBaseProps<T> {
  currentData: T;
}

export interface FormUpdateModalBaseProps<T> extends FormModalBaseProps<T> {
  currentData: T;
}

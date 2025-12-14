import { ZodObject, ZodRawShape, ZodEffects, ZodTypeAny } from "zod";

export function getRequiredFields<T extends ZodRawShape>(
  schema: ZodObject<T> | ZodEffects<ZodObject<T>>
) {
  const shape =
    schema instanceof ZodEffects
      ? (schema.innerType() as ZodObject<ZodRawShape>).shape
      : schema.shape;

  const requiredFields: string[] = [];

  for (const key in shape) {
    const field = shape[key] as ZodTypeAny;
    if (!field.isOptional()) {
      requiredFields.push(key);
    }
  }
  return requiredFields;
}

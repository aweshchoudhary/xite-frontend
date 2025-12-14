import { ZodObject, ZodRawShape, ZodTypeAny } from "zod";

function isZodEffects(
  schema: unknown
): schema is { innerType: () => ZodObject<ZodRawShape> } {
  return (
    typeof schema === "object" &&
    schema !== null &&
    "innerType" in schema &&
    typeof (schema as { innerType?: unknown }).innerType === "function"
  );
}

export function getRequiredFields<T extends ZodRawShape>(
  schema: ZodObject<T> | { innerType: () => ZodObject<T> }
) {
  const shape = isZodEffects(schema)
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

"use client";

import { z } from "zod";

// Email field must contain only @xedinstitute.org

export const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required")
    .refine((email) => email.endsWith("@xedinstitute.org"), {
      message: "Please use XED email address",
    }),
});

export type FormSchema = z.infer<typeof formSchema>;

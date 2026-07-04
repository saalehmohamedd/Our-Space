// src/lib/schemas/card-schema.ts
import { z } from "zod";

export const cardSchema = z.object({
  nickname: z.string().min(1, "Nickname is required").max(50),
  last4: z
    .string()
    .length(4, "Last 4 digits must be exactly 4 characters")
    .regex(/^\d{4}$/, "Must be exactly 4 digits"),
  brand: z.enum(["VISA", "MASTERCARD", "AMEX", "MEEZA", "OTHER"]),
  expiryMonth: z
    .number()
    .int()
    .min(1)
    .max(12)
    .nullable()
    .optional(),
  expiryYear: z
    .number()
    .int()
    .min(new Date().getFullYear())
    .max(new Date().getFullYear() + 20)
    .nullable()
    .optional(),
  colorTheme: z.string().default("indigo"),
});

export type CardFormData = z.infer<typeof cardSchema>;
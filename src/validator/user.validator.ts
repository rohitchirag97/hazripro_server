import z from "zod";

export const updateUserSchema = z.object({
  fname: z.string().optional(),
  lname: z.string().optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Invalid phone number")
    .optional(),
}).refine((updates) => Object.keys(updates).length > 0, {
  message: "Provide at least one field to update",
});

import { z } from "zod";

export const sendotpSchema = z.object({
  phone: z.string().min(12, "Phone number must be with country code"),
});

export const verifyotpSchema = z.object({
  phone: z.string().min(12, "Phone number must be with country code"),
  otp: z.string().length(6, "OTP must be 6 characters long"),
});

export const createUserSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  phone: z.string().min(12, "Phone number must be with country code"),
});

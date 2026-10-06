import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";
import "dotenv/config";
expand(config());

const envSchema = z.object({
  PORT: z.string("PORT is required"),
  DATABASE_URL: z.string("DATABASE_URL is required"),
  JWT_SECRET: z.string("JWT_SECRET is required"),
  JWT_ACCESS_EXPIRES_IN: z.string("JWT_ACCESS_EXPIRES_IN is required"),
  JWT_REFRESH_EXPIRES_IN: z.string("JWT_REFRESH_EXPIRES_IN is required"),
  REDIS_URL: z.string("REDIS_URL is required"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;

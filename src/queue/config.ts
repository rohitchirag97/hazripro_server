import { env } from "@/utils/env";

export const queueNames = {
  otp: "otpQueue",
} as const;

/** Return connection options per BullMQ instance. */
export const getQueueConnection = () => ({
  url: env.REDIS_URL,
});

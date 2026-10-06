import { Worker } from "bullmq";
import { getQueueConnection, queueNames } from "@/queue/config";

export function createOtpWorker() {
  return new Worker(
    queueNames.otp,
    async (job) => {
      if (job.name !== "sendOtp") {
        throw new Error(`Unsupported OTP queue job: ${job.name}`);
      }

      const { phone, otp } = job.data;
      if (!phone || !otp) {
        throw new Error("OTP job is missing its phone or code");
      }

      if (process.env.NODE_ENV === "production") {
        throw new Error("OTP SMS provider is not configured");
      }

      // Development-only output. Do not log OTPs or phone numbers in production.
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate async operation
      console.log(`Development OTP for ${phone}: ${otp}`);
    },
    { connection: getQueueConnection() },
  );
}

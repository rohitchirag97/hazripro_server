import { Queue } from "bullmq";
import { getQueueConnection, queueNames } from "@/queue/config";
import { registerQueue } from "@/queue/lifecycle";

export const otpQueue = registerQueue(
  new Queue(queueNames.otp, {
    connection: getQueueConnection(),
  }),
);

export async function sendOtp(phone: string, otp: string) {
  await otpQueue.add(
    "sendOtp",
    { phone, otp },
    { attempts: 3, backoff: { type: "exponential", delay: 5000 } },
  );
}

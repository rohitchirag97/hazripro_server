import { Context } from "hono";
import { sendotpSchema, verifyotpSchema } from "@/validator/auth.validator";
import { createUser, getUserbyPhone } from "@/services/user.services";
import { compareHash, hash } from "@/utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/services/jwt.services";
import { del, get, set } from "@/utils/redis";
import { getUsersOrganizations } from "@/services/organizations.services";
import { sendResponse } from "@/utils/response";
import { sendOtp } from "@/queue/producer/sendOtp";

export const sendotp: (c: Context) => Promise<Response> = async (
  c: Context,
) => {
  try {
    const { phone } = sendotpSchema.parse(await c.req.json());
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const mobile = phone.replace(/\D/g, "");
    const hashedOtp = await hash(otp);
    await set(`otp:${mobile}`, hashedOtp, 900);
    await sendOtp(mobile, otp);
    return sendResponse(c, "success", "OTP sent successfully", null, 200);
  } catch (error) {
    return sendResponse(c, "error", "Internal server error", null, 500);
  }
};

export const verifyotp: (c: Context) => Promise<Response> = async (
  c: Context,
) => {
  try {
    const { phone, otp } = await verifyotpSchema.parseAsync(await c.req.json());
    const otpKey = `otp:${phone}`;
    const storedOtp = await get(otpKey);
    if (!storedOtp || !(await compareHash(otp, storedOtp))) {
      return sendResponse(c, "error", "Incorrect OTP", null, 400);
    }
    const user =
      (await getUserbyPhone(phone)) ??
      (await createUser({ fname: "New", lname: "User", phone }));
    const userOrganizations = await getUsersOrganizations(user.id);
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await del(otpKey);
    return sendResponse(c, "success", "OTP verified successfully", {
      user,
      userOrganizations,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return sendResponse(c, "error", "Internal server error", null, 500);
  }
};

export const getLoggedInUserController: (
  c: Context,
) => Promise<Response> = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return sendResponse(c, "error", "User not found", null, 404);
    }
    const userOrganizations = await getUsersOrganizations(user.id);
    return sendResponse(c, "success", "User fetched successfully", {
      user,
      userOrganizations,
    });
  } catch (error) {
    return sendResponse(c, "error", "Internal server error", null, 500);
  }
};
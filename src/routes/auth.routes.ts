import { Hono } from "hono";
import {
  getLoggedInUserController,
  sendotp,
  verifyotp
} from "@/controller/auth.controller";
import { authenticate } from "@/middleware/authenticate.middleware";

const authRoutes: Hono = new Hono();

authRoutes.post("/send-otp", sendotp);
authRoutes.post("/verify-otp", verifyotp);

authRoutes.get("/me", authenticate, getLoggedInUserController);

export default authRoutes;
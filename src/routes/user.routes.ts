import { Hono } from "hono";

import { authenticate } from "@/middleware/authenticate.middleware";
import { updateMe } from "@/controller/user.controller";

const userRoutes:Hono = new Hono();


userRoutes.patch("/", authenticate, updateMe);

export default userRoutes;
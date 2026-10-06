import { Hono } from "hono";
import { cors } from "hono/cors";

import { env } from "@/utils/env";
import authRoutes from "@/routes/auth.routes";
import userRoutes from "@/routes/user.routes";
import organizationRoutes from "@/routes/organization.route";
import { registerShutdownHandlers } from "@/lifecycle/shutdown";

const app: Hono = new Hono({ strict: false });
app.use(cors());

const $apiPrefix: string = "/api/v1";

app.route(`${$apiPrefix}/auth`, authRoutes);
app.route(`${$apiPrefix}/user`, userRoutes);
app.route(`${$apiPrefix}/organization`, organizationRoutes);

const server = Bun.serve({
  port: Number(env.PORT),
  fetch: app.fetch,
});

console.info(`API listening on port ${server.port}`);

registerShutdownHandlers(server);

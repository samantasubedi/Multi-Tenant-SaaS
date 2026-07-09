import { Elysia, t } from "elysia";
import { authPlugin } from "../../lib/auth";
import { authController } from "./controllers/auth.controller";
import { ApiError } from "../../lib/errors";

const registerSchema = t.Object({
  name: t.String({ minLength: 2 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  organizationName: t.String({ minLength: 2 }),
  organizationSlug: t.String({ minLength: 2, pattern: "^[a-z0-9-]+$" }),
});

const loginSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(authPlugin)
  .post("/register", authController.register, { body: registerSchema })
  .post("/login", authController.login, { body: loginSchema })
  .post("/logout", authController.logout)
  .get("/me", async ({ headers, jwt }: any) => {
    const authHeader = headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";
    if (!token) throw new ApiError(401, "Unauthorized");
    const payload = await jwt.verify(token);
    if (!payload) throw new ApiError(401, "Unauthorized");
    return payload;
  })
  .post("/bootstrap-super-admin", authController.bootstrapSuperAdmin, {
    body: t.Object({
      name: t.String({ minLength: 2 }),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 }),
    }),
  });

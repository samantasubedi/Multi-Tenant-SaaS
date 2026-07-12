import { Elysia, t } from "elysia";
import { protectedPlugin } from "../../lib/auth";
import { tenantController } from "./controllers/tenant.controller";

export const tenantRoutes = new Elysia({ prefix: "/tenants" })
  .use(protectedPlugin)
  .get("/", tenantController.list)
  .get("/me", tenantController.getMe)
  .post("/", tenantController.create, {
    body: t.Object({
      name: t.String({ minLength: 2 }),
      slug: t.String({ minLength: 2, pattern: "^[a-z0-9-]+$" }),
    }),
  })
  .patch("/:id", tenantController.update, {
    params: t.Object({ id: t.String({ format: "uuid" }) }),
    body: t.Object({
      name: t.String({ minLength: 2 }),
      slug: t.String({ minLength: 2, pattern: "^[a-z0-9-]+$" }),
    }),
  });

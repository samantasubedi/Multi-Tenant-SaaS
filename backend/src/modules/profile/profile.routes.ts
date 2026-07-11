import { Elysia } from "elysia";
import { protectedPlugin } from "../../lib/auth";
import { profileController } from "./controllers/profile.controller";

export const profileRoutes = new Elysia({ prefix: "/profile" })
  .use(protectedPlugin)
  .get("/me", profileController.me);

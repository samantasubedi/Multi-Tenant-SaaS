import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import "dotenv/config";
import { Elysia } from "elysia";
import { authRoutes } from "./modules/auth/auth.routes";

import { profileRoutes } from "./modules/profile/profile.routes";

import { ApiError } from "./lib/errors";

const port = Number(process.env.PORT || 4000);

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    }),
  )

  .onError(({ code, error, set }) => {
    if (error instanceof ApiError) {
      set.status = error.status;
      return { message: error.message };
    }

    if (code === "VALIDATION") {
      set.status = 422;
      return {
        message: "Validation error",
        details: error.message,
      };
    }

    console.log(error);
    set.status = 500;
    return { message: "Internal server error" };
  })
  .get("/health", () => ({ status: "ok" }))
  .use(authRoutes)

  .use(profileRoutes)
  .listen(port);

console.log(`server running at http://localhost:${port}`);


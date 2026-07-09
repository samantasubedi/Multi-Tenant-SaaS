import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";
import type { Role } from "../db/schema";
import { ApiError } from "./errors";

export type AuthPayload = {
  sub: string;
  tenantId: string | null;
  role: Role;
  email: string;
  name: string;
};

const JWT_SECRET =
  process.env.JWT_SECRET!;


export const authPlugin = new Elysia({ name: "auth-plugin" }).use(
  jwt({ name: "jwt", secret: JWT_SECRET }),
);

export const protectedPlugin = new Elysia({ name: "protected-plugin" })
  .use(jwt({ name: "jwt", secret: JWT_SECRET }))
  .derive(
    { as: "scoped" },
    async ({ headers, jwt }): Promise<{ auth: AuthPayload | null }> => {
      const authHeader =
        (headers as Record<string, string>)["authorization"] || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : "";
      if (!token) return { auth: null };
      const payload = await (jwt).verify(token);
      if (!payload) return { auth: null };
      return { auth: payload as AuthPayload };
    },
  )
  .onBeforeHandle(
    { as: "scoped" },
    ({ auth }: { auth: AuthPayload | null }) => {
      if (!auth) throw new ApiError(401, "Unauthorized");
    },
  );

export const hasRole = (userRole: Role, allowed: Role[]) =>{
  return allowed.includes(userRole);
}
import { count, eq } from "drizzle-orm";
import { db } from "../../../db/client";
import { tenants, users } from "../../../db/schema";

export const dashboardRepository = {
  async countTenants() {
    const [result] = await db.select({ total: count() }).from(tenants);
    if (!result) {
      return console.log("db fetch failed");
    }
    return Number(result.total);
  },

  async countUsers() {
    const [result] = await db.select({ total: count() }).from(users);
    if (!result) {
      return console.log("db fetch failed");
    }
    return Number(result.total);
  },

  async countUsersByTenant(tenantId: string) {
    const [result] = await db
      .select({ total: count() })
      .from(users)
      .where(eq(users.tenantId, tenantId));
    if (!result) {
      return console.log("db fetch failed");
    }
    return Number(result.total);
  },
};

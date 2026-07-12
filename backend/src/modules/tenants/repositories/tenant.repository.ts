import { eq } from 'drizzle-orm';
import { db } from '../../../db/client';
import { tenants } from '../../../db/schema';

export const tenantRepository = {
  findAll: () => db.select().from(tenants),

  findById: (id: string) => db.query.tenants.findFirst({ where: eq(tenants.id, id) }),

  create: (payload: { name: string; slug: string }) =>
    db.insert(tenants).values(payload).returning().then((rows) => rows[0]),

  update: (id: string, payload: { name: string; slug: string }) =>
    db
      .update(tenants)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning()
      .then((rows) => rows[0])
};

import { eq } from 'drizzle-orm';
import { db } from '../../../db/client';
import { tenants, users } from '../../../db/schema';

export const authRepository = {
  findUserByEmail: (email: string) => db.query.users.findFirst({ where: eq(users.email, email) }),

  findTenantBySlug: (slug: string) => db.query.tenants.findFirst({ where: eq(tenants.slug, slug) }),

  createTenant: (payload: { name: string; slug: string }) =>
    db.insert(tenants).values(payload).returning().then((rows) => rows[0]),

  createUser: (payload: {
    tenantId: string | null;
    name: string;
    email: string;
    passwordHash: string;
    role: 'super_admin' | 'tenant_admin' | 'member';
  }) => db.insert(users).values(payload).returning().then((rows) => rows[0])
};

import { eq } from 'drizzle-orm';
import { db } from '../../../db/client';
import { users } from '../../../db/schema';

export const profileRepository = {
  findByUserId: (id: string) => db.query.users.findFirst({ where: eq(users.id, id) })
};

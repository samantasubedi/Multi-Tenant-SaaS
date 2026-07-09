import type { Role } from '../db/schema';
import { ApiError } from './errors';

export const requireRole = (role: Role, allowed: Role[]) => {
  if (!allowed.includes(role)) {
    throw new ApiError(403, 'Forbidden');
  }
};

export const canAccessTenant = (userTenantId: string | null, targetTenantId: string, role: Role) => {
  if (role === 'super_admin') {
    return true;
  }

  return userTenantId === targetTenantId;
};

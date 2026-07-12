import { type AuthPayload } from "../../../lib/auth";
import { ApiError } from "../../../lib/errors";
import { canAccessTenant, requireRole } from "../../../lib/rbac";
import { tenantRepository } from "../repositories/tenant.repository";

export const tenantService = {
  async list(auth: AuthPayload) {
    if (auth.role === "super_admin") {
      return tenantRepository.findAll();
    }
    if (!auth.tenantId)
      throw new ApiError(400, "User is not assigned to a tenant");
    const tenant = await tenantRepository.findById(auth.tenantId);
    return tenant ? [tenant] : [];
  },

  async getMe(auth: AuthPayload) {
    if (!auth.tenantId)
      throw new ApiError(400, "User is not assigned to a tenant");
    const tenant = await tenantRepository.findById(auth.tenantId);
    if (!tenant) throw new ApiError(404, "Tenant not found");
    return tenant;
  },

  async create(auth: AuthPayload, payload: { name: string; slug: string }) {
    requireRole(auth.role, ["super_admin"]);
    return tenantRepository.create(payload);
  },

  async update(
    auth: AuthPayload,
    tenantId: string,
    payload: { name: string; slug: string },
  ) {
    if (!canAccessTenant(auth.tenantId, tenantId, auth.role)) {
      throw new ApiError(403, "Cannot update another tenant");
    }
    if (auth.role === "member") throw new ApiError(403, "Forbidden");

    const updated = await tenantRepository.update(tenantId, payload);
    if (!updated) throw new ApiError(404, "Tenant not found");
    return updated;
  },
};

import { type AuthPayload } from "../../../lib/auth";
import { ApiError } from "../../../lib/errors";
import { dashboardRepository } from "../repositories/dashboard.repository";

export const dashboardService = {
  async stats(auth: AuthPayload) {
    if (auth.role === "super_admin") {
      const [totalTenants, totalUsers] = await Promise.all([
        dashboardRepository.countTenants(),
        dashboardRepository.countUsers(),
      ]);
      return { totalTenants, totalUsers, currentUser: auth };
    }

    if (!auth.tenantId)
      throw new ApiError(400, "User is not assigned to a tenant");

    const totalUsers = await dashboardRepository.countUsersByTenant(
      auth.tenantId,
    );
    return { totalTenants: 1, totalUsers, currentUser: auth };
  },
};

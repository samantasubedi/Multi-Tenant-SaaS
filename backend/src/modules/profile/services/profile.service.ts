import { type AuthPayload } from "../../../lib/auth";
import { ApiError } from "../../../lib/errors";
import { profileRepository } from "../repositories/profile.repository";
export const profileService = {
  async me(auth: AuthPayload) {
    const user = await profileRepository.findByUserId(auth.sub);
    if (!user) throw new ApiError(404, "User not found");

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
};

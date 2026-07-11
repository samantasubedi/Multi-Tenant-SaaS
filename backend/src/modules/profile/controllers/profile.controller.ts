import { type AuthPayload } from "../../../lib/auth";
import { profileService } from "../services/profile.service";

export const profileController = {
me: (context: { auth: AuthPayload | null }) => profileService.me(context.auth as AuthPayload),
};

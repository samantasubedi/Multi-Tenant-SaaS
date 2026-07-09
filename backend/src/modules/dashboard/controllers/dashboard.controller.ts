import { type AuthPayload } from "../../../lib/auth";
import { dashboardService } from "../services/dashboard.service";

export const dashboardController = {
  stats: ({ auth }: { auth: AuthPayload }) => dashboardService.stats(auth),
};

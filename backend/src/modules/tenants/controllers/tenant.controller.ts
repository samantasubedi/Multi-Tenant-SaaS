import { type AuthPayload } from "../../../lib/auth";
import { tenantService } from "../services/tenant.service";

export const tenantController = {
  list: ({ auth }: { auth: AuthPayload }) => tenantService.list(auth),
  getMe: ({ auth }: { auth: AuthPayload }) => tenantService.getMe(auth),
  create: ({ auth, body }: { auth: AuthPayload; body: any }) =>
    tenantService.create(auth, body),
  update: ({
    auth,
    body,
    params,
  }: {
    auth: AuthPayload;
    body: any;
    params: any;
  }) => tenantService.update(auth, params.id, body),
};

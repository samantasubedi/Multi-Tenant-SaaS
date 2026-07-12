import { type AuthPayload } from "../../../lib/auth";
import { tenantService } from "../services/tenant.service";

export const tenantController = {
  list: ( context: { auth: AuthPayload|null }) => tenantService.list(context.auth as AuthPayload),
  getMe: (context: { auth: AuthPayload|null }) => tenantService.getMe(context.auth as AuthPayload),
  create: (context: { auth: AuthPayload|null, body: any }) =>
    tenantService.create(context.auth as AuthPayload, context.body),
  update: ({
    auth,
    body,
    params,
  }: {
    auth: AuthPayload|null;
    body: any;
    params: any;
  }) => tenantService.update(auth as AuthPayload, params.id, body),
};

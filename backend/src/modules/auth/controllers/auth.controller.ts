import { authService } from "../services/auth.service";

export const authController = {
  register: async (ctx: any) => {
    return authService.register({
      ...ctx.body,
      signJwt: ctx.jwt.sign.bind(ctx.jwt),
    });
  },

  login: async (ctx: any) => {
    return authService.login({
      ...ctx.body,
      signJwt: ctx.jwt.sign.bind(ctx.jwt),
    });
  },

  logout: (_ctx: any) => {
    return { message: "Logged out successfully" };
  },

  bootstrapSuperAdmin: (ctx: any) => authService.bootstrapSuperAdmin(ctx.body),
};

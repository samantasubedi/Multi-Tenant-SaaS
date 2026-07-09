import type { Role } from "../../../db/schema";
import { ApiError } from "../../../lib/errors";
import { authRepository } from "../repositories/auth.repository";

type JwtSigner = (payload: {
  sub: string;
  tenantId: string | null;
  role: Role;
  email: string;
  name: string;
}) => Promise<string>;

export const authService = {
  async register(input: {
    name: string;
    email: string;
    password: string;
    organizationName: string;
    organizationSlug: string;
    signJwt: JwtSigner;
  }) {
    const existingUser = await authRepository.findUserByEmail(input.email);
    if (existingUser) throw new ApiError(409, "Email is already in use");

    const existingTenant = await authRepository.findTenantBySlug(
      input.organizationSlug,
    );
    if (existingTenant)
      throw new ApiError(409, "Organization slug is already in use");

    const tenant = await authRepository.createTenant({
      name: input.organizationName,
      slug: input.organizationSlug,
    });

    const passwordHash = await Bun.password.hash(input.password);
    const user = await authRepository.createUser({
      tenantId: tenant!.id,
      name: input.name,
      email: input.email,
      passwordHash,
      role: "tenant_admin",
    });
    if (!user) {
      return console.log("user not found");
    }
    const token = await input.signJwt({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
      tenant,
    };
  },

  async login(input: { email: string; password: string; signJwt: JwtSigner }) {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) throw new ApiError(401, "Invalid credentials");

    const valid = await Bun.password.verify(input.password, user.passwordHash);
    if (!valid) throw new ApiError(401, "Invalid credentials");

    const token = await input.signJwt({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  },

  async bootstrapSuperAdmin(input: {
    name: string;
    email: string;
    password: string;
  }) {
    if (process.env.ALLOW_BOOTSTRAP_SUPER_ADMIN !== "true") {
      throw new ApiError(403, "Bootstrapping super admin is disabled");
    }

    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw new ApiError(409, "User already exists");

    const passwordHash = await Bun.password.hash(input.password);
    const user = await authRepository.createUser({
      tenantId: null,
      name: input.name,
      email: input.email,
      passwordHash,
      role: "super_admin",
    });
    if (!user) {
      return console.log("user doesnt exist");
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  },
};

import { Dependency } from "@/helpers/dependency";
import { UserService } from "@/services/user";
import { StoreService } from "./store";
import { prisma } from "@repo/database";

export const userService = new UserService(prisma);
export const storeService = new StoreService(prisma);

export const userHonoService = new Dependency(
  (c, prisma, auth) => new UserService(prisma),
);

export const storeHonoService = new Dependency(
  (c, prisma, auth) => new StoreService(prisma),
);

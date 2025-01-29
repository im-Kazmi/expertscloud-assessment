import { Dependency } from "../helpers/dependency";

//services
import { UserService } from "./user";
import { ProjectService } from "./project";
import { OrganizationService } from "./org";
import { WebhookService } from "./webhooks";
import { TaskService } from "./task";
// services

import { prisma } from "@repo/database";

export const userService = new UserService(prisma);
export const projectService = new ProjectService(prisma);
export const orgService = new OrganizationService(prisma);
export const taskService = new OrganizationService(prisma);

export const userHonoService = new Dependency(
  (c, prisma, auth) => new UserService(prisma),
);

export const orgHonoService = new Dependency(
  (c, prisma, auth) => new OrganizationService(prisma),
);

export const projectHonoService = new Dependency(
  (c, prisma, auth) => new ProjectService(prisma),
);

export const taskHonoService = new Dependency(
  (c, prisma, auth) => new TaskService(prisma),
);

export const webhookHonoService = new Dependency(
  (c, prisma, auth) => new WebhookService(prisma),
);

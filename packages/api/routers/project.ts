import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { projectHonoService, orgHonoService } from "../services";

export const createProjectSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});

const app = new Hono()
  .use(clerkMiddleware())
  .use(projectHonoService.middleware("projectService"))
  .get("/list", async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        400,
      );
    }

    const projectService = c.var.projectService;

    if (!auth.orgId) {
      return c.json(
        {
          message: "No organization found for this user.",
        },
        400,
      );
    }

    const projects = await projectService.getProjectsByOrgId(auth.orgId);
    return c.json(projects, 200);
  })
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");
    const projectService = c.var.projectService;

    const project = await projectService.getProjectById(id);

    if (!project) {
      return c.json(
        {
          message: "Project not found.",
        },
        404,
      );
    }

    return c.json(project, 200);
  })
  .post("/", zValidator("json", createProjectSchema), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        400,
      );
    }

    if (!auth.orgId) {
      return c.json(
        {
          message: "You are not a member of any organization.",
        },
        400,
      );
    }

    const projectService = c.var.projectService;
    const values = c.req.valid("json");

    const project = await projectService.createProject({
      ...values,
      org: {
        connect: {
          id: auth.orgId,
        },
      },
    });

    return c.json(project, 200);
  })
  .post("/:id/update", zValidator("json", updateProjectSchema), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        400,
      );
    }

    const { id } = c.req.param();
    const projectService = c.var.projectService;
    const values = c.req.valid("json");

    const updatedProject = await projectService.updateProject(id, values);
    return c.json(updatedProject, 200);
  })
  .post("/:id/delete", async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        400,
      );
    }

    const { id } = c.req.param();
    const projectService = c.var.projectService;

    await projectService.deleteProject(id);

    return c.json(
      {
        message: "Project deleted successfully.",
      },
      200,
    );
  })
  .post("/:id/complete", async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        400,
      );
    }

    const { id } = c.req.param();
    const projectService = c.var.projectService;

    const updatedProject = await projectService.markProjectAsCompleted(id);
    return c.json(updatedProject, 200);
  })
  .get("/completed/list", async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        400,
      );
    }

    if (!auth.orgId) {
      return c.json(
        {
          message: "No organization found for this user.",
        },
        400,
      );
    }

    const projectService = c.var.projectService;
    const projects = await projectService.getCompletedProjects(auth.orgId);
    return c.json(projects, 200);
  })
  .get("/incomplete/list", async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        400,
      );
    }

    if (!auth.orgId) {
      return c.json(
        {
          message: "No organization found for this user.",
        },
        400,
      );
    }

    const projectService = c.var.projectService;
    const projects = await projectService.getIncompleteProjects(auth.orgId);
    return c.json(projects, 200);
  });

export default app;

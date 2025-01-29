import { taskHonoService, orgHonoService } from "../services";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const sortingAndPaginationSchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(2, {
    message: "Task title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z.string().optional(),
  orgId: z.string(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z.string().optional(), // ISO date string
});

export const assignUserSchema = z.object({
  userId: z.string(),
});

const app = new Hono()
  .use(clerkMiddleware())
  .use(taskHonoService.middleware("taskService"))
  .use(orgHonoService.middleware("orgService"))
  .get("/list", zValidator("query", sortingAndPaginationSchema), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        400,
      );
    }

    const taskService = c.var.taskService;
    const orgService = c.var.orgService;

    const { page, pageSize, sortBy, sortOrder } = c.req.valid("query");

    if (!auth.orgId) {
      return c.json(
        {
          message: "No organization found for this user.",
        },
        400,
      );
    }

    const tasks = await taskService.getTasksByOrgId(auth.orgId);

    return c.json(tasks, 200);
  })

  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");
    const taskService = c.var.taskService;

    const task = await taskService.getTaskById(id);

    if (!task) {
      return c.json(
        {
          message: "Task not found.",
        },
        404,
      );
    }

    return c.json(task, 200);
  })

  .post("/", zValidator("json", createTaskSchema), async (c) => {
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

    const taskService = c.var.taskService;
    const values = c.req.valid("json");

    const task = await taskService.createTask({
      ...values,
      org: {
        connect: {
          id: auth.orgId,
        },
      },
    });

    return c.json(task, 201);
  })

  .put("/:id", zValidator("json", updateTaskSchema), async (c) => {
    const { id } = c.req.param();
    const taskService = c.var.taskService;
    const values = c.req.valid("json");

    const updatedTask = await taskService.updateTask(id, values);

    return c.json(updatedTask, 200);
  })

  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const taskService = c.var.taskService;

    await taskService.deleteTask(id);

    return c.json(
      {
        message: "Task deleted successfully.",
      },
      200,
    );
  })

  .post("/:id/assign", zValidator("json", assignUserSchema), async (c) => {
    const { id } = c.req.param();
    const { userId } = c.req.valid("json");
    const taskService = c.var.taskService;

    const task = await taskService.assignUserToTask(id, userId);

    return c.json(task, 200);
  })

  .post("/:id/unassign", async (c) => {
    const { id } = c.req.param();
    const taskService = c.var.taskService;

    const task = await taskService.unassignUserFromTask(id);

    return c.json(task, 200);
  });

export default app;

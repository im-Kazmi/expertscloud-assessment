import { taskHonoService, orgHonoService } from "../services";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2, {
    message: "Task title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z.any().optional(),
  projectId: z.string(),
});
export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z.any().optional(),
});

export const assignUserSchema = z.array(z.string());

const app = new Hono()
  .use(clerkMiddleware())
  .use(taskHonoService.middleware("taskService"))
  .use(orgHonoService.middleware("orgService"))
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

    const taskService = c.var.taskService;
    const orgService = c.var.orgService;

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
  .post("/", zValidator("json", createTaskSchema), async (c) => {
    const auth = getAuth(c);

    console.log("creating task");
    if (!auth?.userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        400,
      );
    }
    console.log("userId exists");

    if (!auth.orgId) {
      return c.json(
        {
          message: "You are not a member of any organization.",
        },
        400,
      );
    }

    console.log("there is no org exists");

    const taskService = c.var.taskService;
    const values = c.req.valid("json");

    const task = await taskService.createTask({
      ...values,
    });
    console.log("task created");

    return c.json(task, 200);
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

  .post("/:id/update", zValidator("json", updateTaskSchema), async (c) => {
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
    const taskService = c.var.taskService;
    const values = c.req.valid("json");

    const updatedTask = await taskService.updateTask(id, values);

    return c.json(updatedTask, 200);
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
    const userIds = c.req.valid("json");
    const taskService = c.var.taskService;

    const task = await taskService.manageTaskAssignees(id, userIds);

    return c.json(task, 200);
  })

  .get(
    "/:id/assignees",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
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
      const taskService = c.var.taskService;

      const assignees = await taskService.getTaskAssigneeIds(id);

      return c.json(assignees, 200);
    },
  );

export default app;

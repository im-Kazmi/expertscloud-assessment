import { prisma, Prisma } from "@repo/database";
import { BaseService } from "./base-service";

export class TaskService extends BaseService {
  async createTask(values: Prisma.TaskCreateInput) {
    try {
      const task = await prisma.task.create({
        data: values,
      });
      return task;
    } catch (error) {
      throw new Error(`Error creating task: ${(error as Error).message}`);
    }
  }

  async deleteTask(id: string) {
    try {
      const exists = await this.getTaskById(id);

      if (!exists) {
        throw new Error(`Task does not exist with this ID.`);
      }

      await prisma.task.delete({
        where: { id },
      });
      return { message: "Task deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting task: ${(error as Error).message}`);
    }
  }

  async updateTask(id: string, values: Prisma.TaskUpdateInput) {
    try {
      const exists = await this.getTaskById(id);

      if (!exists) {
        throw new Error(`Task does not exist with this ID.`);
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: values,
      });
      return updatedTask;
    } catch (error) {
      throw new Error(`Error updating task: ${(error as Error).message}`);
    }
  }

  async getTaskById(id: string) {
    try {
      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          org: true,
          assignee: true,
        },
      });
      return task;
    } catch (error) {
      throw new Error(`Error retrieving task: ${(error as Error).message}`);
    }
  }

  async getTasksByOrgId(orgId: string) {
    try {
      const tasks = await prisma.task.findMany({
        where: { orgId },
        include: {
          org: true,
          assignee: true,
        },
      });
      return tasks;
    } catch (error) {
      throw new Error(
        `Error retrieving tasks for organization: ${(error as Error).message}`,
      );
    }
  }

  async assignUserToTask(taskId: string, userId: string) {
    try {
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new Error(`Task does not exist with this ID.`);
      }

      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });
      if (!user) {
        throw new Error(`User does not exist with this ID.`);
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          assignee: {
            connect: { clerkId: userId },
          },
        },
      });
      return updatedTask;
    } catch (error) {
      throw new Error(
        `Error assigning user to task: ${(error as Error).message}`,
      );
    }
  }

  async unassignUserFromTask(taskId: string) {
    try {
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new Error(`Task does not exist with this ID.`);
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          assignee: {
            disconnect: true,
          },
        },
      });
      return updatedTask;
    } catch (error) {
      throw new Error(
        `Error unassigning user from task: ${(error as Error).message}`,
      );
    }
  }

  async getTasksByUserId(userId: string) {
    try {
      const tasks = await prisma.task.findMany({
        where: { assigneeId: userId },
        include: {
          org: true,
          assignee: true,
        },
      });
      return tasks;
    } catch (error) {
      throw new Error(
        `Error retrieving tasks for user: ${(error as Error).message}`,
      );
    }
  }
}

import { prisma, Prisma } from "@repo/database";
import { BaseService } from "./base-service";

export class TaskService extends BaseService {
  async createTask(values: Prisma.TaskCreateInput) {
    try {
      const task = await prisma.task.create({
        data: {
          ...values,
          dueDate: new Date(values?.dueDate!),
        },
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
          assignees: {
            include: {
              user: true,
            },
          },
          project: true,
        },
      });
      return task;
    } catch (error) {
      throw new Error(`Error retrieving task: ${(error as Error).message}`);
    }
  }

  async getTasksByOrgId(projectId: string) {
    try {
      const tasks = await prisma.task.findMany({
        where: { projectId },
        include: {
          assignees: {
            include: {
              user: true,
            },
          },
          project: true,
        },
      });

      return tasks;
    } catch (error) {
      throw new Error(
        `Error retrieving tasks for organization: ${(error as Error).message}`,
      );
    }
  }

  async assignUserToTask(taskId: string, userIds: string[]) {
    try {
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new Error(`Task does not exist with this ID.`);
      }

      const assignees = await prisma.taskAssignee.createMany({
        data: userIds.map((id) => ({
          taskId: task.id,
          userId: id,
        })),
      });
      return assignees;
    } catch (error) {
      throw new Error(
        `Error assigning user to task: ${(error as Error).message}`,
      );
    }
  }

  async manageTaskAssignees(taskId: string, userIds: string[]) {
    try {
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new Error(`Task does not exist with this ID.`);
      }

      const existingAssignees = await prisma.taskAssignee.findMany({
        where: {
          taskId: task.id,
          userId: {
            in: userIds,
          },
        },
      });

      const existingUserIds = existingAssignees.map(
        (assignee) => assignee.userId,
      );

      const usersToAssign = userIds.filter(
        (userId) => !existingUserIds.includes(userId),
      );

      const usersToUnassign = userIds.filter((userId) =>
        existingUserIds.includes(userId),
      );

      if (usersToAssign.length > 0) {
        await prisma.taskAssignee.createMany({
          data: usersToAssign.map((userId) => ({
            taskId: task.id,
            userId,
          })),
        });
      }

      if (usersToUnassign.length > 0) {
        await prisma.taskAssignee.deleteMany({
          where: {
            taskId: task.id,
            userId: {
              in: usersToUnassign,
            },
          },
        });
      }

      return {
        assigned: usersToAssign,
        unassigned: usersToUnassign,
      };
    } catch (error) {
      throw new Error(
        `Error managing task assignees: ${(error as Error).message}`,
      );
    }
  }

  async getTaskAssigneeIds(
    taskId: string,
  ): Promise<{ label: string; value: string }[]> {
    try {
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new Error(`Task does not exist with this ID.`);
      }

      const assignees = await prisma.taskAssignee.findMany({
        where: {
          taskId: task.id,
        },
        include: {
          user: true,
        },
      });

      return assignees.map((assignee) => ({
        label: assignee.user.name,
        value: assignee.user.clerkId,
      }));
    } catch (error) {
      throw new Error(
        `Error retrieving task assignee IDs: ${(error as Error).message}`,
      );
    }
  }
}

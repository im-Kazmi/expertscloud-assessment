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

  async unassignUserFromTask(taskId: string, userIds: string[]) {
    try {
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new Error(`Task does not exist with this ID.`);
      }

      const deletedAssignment = await prisma.taskAssignee.deleteMany({
        where: {
          userId: {
            in: userIds,
          },
        },
      });
      return deletedAssignment;
    } catch (error) {
      throw new Error(
        `Error unassigning user from task: ${(error as Error).message}`,
      );
    }
  }

  async getTasksByUserId(userId: string) {
    try {
      const taskAssignees = await prisma.taskAssignee.findMany({
        where: { userId },
        include: {
          task: {
            include: {
              project: true,
            },
          },
        },
      });

      const tasks = taskAssignees.map((ta) => ta.task);
      return tasks;
    } catch (error) {
      throw new Error(
        `Error retrieving tasks for user: ${(error as Error).message}`,
      );
    }
  }

  // async getBurndownData(projectId: string) {
  //   try {
  //     // Fetch all tasks for the project
  //     const tasks = await prisma.task.findMany({
  //       where: { projectId },
  //       select: {
  //         id: true,
  //         status: true,
  //         createdAt: true,
  //         completedAt: true,
  //       },
  //     });

  //     // Calculate the total number of tasks
  //     const totalTasks = tasks.length;

  //     // Group tasks by date and calculate remaining work
  //     const burndownData: { date: string; remainingTasks: number }[] = [];
  //     const taskCompletionMap: { [date: string]: number } = {};

  //     // Initialize task completion map
  //     tasks.forEach((task) => {
  //       const date = task.completedAt
  //         ? task.completedAt.toISOString().split("T")[0]
  //         : null;
  //       if (date) {
  //         taskCompletionMap[date] = (taskCompletionMap[date] || 0) + 1;
  //       }
  //     });

  //     // Calculate remaining tasks for each day
  //     let remainingTasks = totalTasks;
  //     const startDate = new Date(tasks[0]?.createdAt || new Date());
  //     const endDate = new Date();
  //     for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
  //       const dateKey = d.toISOString().split("T")[0];
  //       const completedToday = taskCompletionMap[dateKey] || 0;
  //       remainingTasks -= completedToday;

  //       burndownData.push({
  //         date: dateKey,
  //         remainingTasks: remainingTasks < 0 ? 0 : remainingTasks,
  //       });
  //     }

  //     return burndownData;
  //   } catch (error) {
  //     throw new Error(
  //       `Error calculating burndown data: ${(error as Error).message}`,
  //     );
  //   }
  // }
}

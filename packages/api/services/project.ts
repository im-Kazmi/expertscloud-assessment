import { prisma, Prisma } from "@repo/database";
import { BaseService } from "./base-service";

export class ProjectService extends BaseService {
  async createProject(values: Prisma.ProjectCreateInput) {
    try {
      const project = await prisma.project.create({
        data: {
          ...values,
          tasks: {
            createMany: {
              data: [
                {
                  title: "Hire kazmi",
                  description: "Hire kazmi directly",
                  priority: "CRITICAL",
                  status: "TODO",
                },
                {
                  title: "Hire kazmi",
                  description: "Hire kazmi directly",
                  priority: "CRITICAL",
                  status: "COMPLETED",
                },
              ],
            },
          },
        },
      });
      return project;
    } catch (error) {
      throw new Error(`Error creating project: ${(error as Error).message}`);
    }
  }

  async deleteProject(orgId: string, id: string) {
    try {
      const exists = await this.getProjectById(orgId, id);

      if (!exists) {
        throw new Error(`Project does not exist with this ID.`);
      }

      await prisma.project.delete({
        where: { id, orgId },
      });
      return { message: "Project deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting project: ${(error as Error).message}`);
    }
  }

  async updateProject(
    orgId: string,
    id: string,
    values: Prisma.ProjectUpdateInput,
  ) {
    try {
      const exists = await this.getProjectById(orgId, id);

      if (!exists) {
        throw new Error(`Project does not exist with this ID.`);
      }

      const updatedProject = await prisma.project.update({
        where: { id, orgId },
        data: values,
      });
      return updatedProject;
    } catch (error) {
      throw new Error(`Error updating project: ${(error as Error).message}`);
    }
  }

  async getProjectById(orgId: string, id: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { id, orgId },
        include: {
          tasks: {
            include: {
              assignees: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      return project;
    } catch (error) {
      throw new Error(`Error retrieving project: ${(error as Error).message}`);
    }
  }

  async getProjectsByOrgId(orgId: string) {
    try {
      const projects = await prisma.project.findMany({
        where: { orgId },
        include: {
          org: true,
          tasks: {
            include: {
              assignees: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      return projects;
    } catch (error) {
      throw new Error(
        `Error retrieving projects for organization: ${(error as Error).message}`,
      );
    }
  }

  async markProjectAsCompleted(orgId: string, id: string) {
    try {
      const exists = await this.getProjectById(orgId, id);

      if (!exists) {
        throw new Error(`Project does not exist with this ID.`);
      }

      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          completedAt: new Date(),
        },
      });
      return updatedProject;
    } catch (error) {
      throw new Error(
        `Error marking project as completed: ${(error as Error).message}`,
      );
    }
  }

  async getCompletedProjects(orgId: string) {
    try {
      const projects = await prisma.project.findMany({
        where: {
          orgId,
          completedAt: { not: null },
        },
        include: {
          org: true,
          tasks: {
            include: {
              assignees: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      return projects;
    } catch (error) {
      throw new Error(
        `Error retrieving completed projects: ${(error as Error).message}`,
      );
    }
  }

  async getIncompleteProjects(orgId: string) {
    try {
      const projects = await prisma.project.findMany({
        where: {
          orgId,
          completedAt: null,
        },
        include: {
          org: true,
          tasks: {
            include: {
              assignees: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      return projects;
    } catch (error) {
      throw new Error(
        `Error retrieving incomplete projects: ${(error as Error).message}`,
      );
    }
  }
}

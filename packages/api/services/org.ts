import { prisma, Prisma } from "@repo/database";
import { BaseService } from "./base-service";

export class OrganizationService extends BaseService {
  async createOrganization(values: Prisma.OrganizationCreateInput) {
    try {
      const org = await prisma.organization.create({
        data: values,
      });

      return org;
    } catch (error) {
      throw new Error(
        `Error creating organization: ${(error as Error).message}`,
      );
    }
  }

  async deleteOrganization(id: string) {
    try {
      const exists = await this.getOrganizationById(id);

      if (!exists) {
        throw new Error(`org does not exists with this id.`);
      }

      await prisma.organization.delete({
        where: { id },
      });
      return { message: "org deleted successfully" };
    } catch (error) {
      throw new Error(
        `Error deleting organization: ${(error as Error).message}`,
      );
    }
  }

  async updateOrganization(id: string, values: Prisma.OrganizationUpdateInput) {
    try {
      const exists = await this.getOrganizationById(id);

      if (!exists) {
        throw new Error(`organization does not exists with this id.`);
      }

      const updatedOrganization = await prisma.organization.update({
        where: { id },
        data: values,
      });
      return updatedOrganization;
    } catch (error) {
      throw new Error(
        `Error updating organization: ${(error as Error).message}`,
      );
    }
  }

  async getOrganizationById(id: string) {
    try {
      const organization = await prisma.organization.findUnique({
        where: { id },
      });

      return organization;
    } catch (error) {
      throw new Error(
        `Error retrieving organization: ${(error as Error).message}`,
      );
    }
  }
}

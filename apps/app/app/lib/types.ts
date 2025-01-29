import { Task, Prisma, Organization } from "@prisma/client";

export interface Column {
  id: string;
  title: string;
}

export interface KanbanState {
  tasks: { [key: string]: Task };
}

export type TaskWithDateStrings = Omit<
  Task,
  "createdAt" | "updatedAt" | "dueDate"
> & {
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
};

export type TaskWithOrg = Omit<Task, "createdAt" | "updatedAt" | "dueDate"> & {
  dueDate: string | null;
} & {
  org: Omit<Organization, "id" | "createdAt" | "updatedAt">;
};

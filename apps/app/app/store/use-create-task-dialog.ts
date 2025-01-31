import { create } from "zustand";

type Types = {
  projectId?: string;
  taskId?: string;
  isOpen: boolean;
  onOpen(projectId: string): void;
  onClose(): void;
  setTaskId: (taskId: string) => void;
};

export const useCreateTaskDialog = create<Types>((set) => ({
  taskId: undefined,
  projectId: undefined,
  isOpen: false,
  onOpen: (projectId: string) => set({ isOpen: true, projectId }),
  onClose: () => set({ isOpen: false, projectId: undefined }),
  setTaskId: (taskId: string) => set({ taskId }),
}));

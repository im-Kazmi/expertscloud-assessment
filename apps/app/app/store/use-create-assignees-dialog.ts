import { create } from "zustand";

type Types = {
  taskId?: string;
  isOpen: boolean;
  onOpen(taskId: string): void;
  onClose(): void;
};

export const useCreateAssigneesDialog = create<Types>((set) => ({
  taskId: undefined,
  isOpen: false,
  onOpen: (taskId: string) => set({ isOpen: true, taskId }),
  onClose: () => set({ isOpen: false, taskId: undefined }),
}));

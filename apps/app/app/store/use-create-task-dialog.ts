import { create } from "zustand";

type Types = {
  projectId?: string;
  isOpen: boolean;
  onOpen(projectId: string): void;
  onClose(): void;
};

export const useCreateTaskDialog = create<Types>((set) => ({
  projectId: undefined,
  isOpen: false,
  onOpen: (projectId: string) => set({ isOpen: true, projectId }),
  onClose: () => set({ isOpen: false, projectId: undefined }),
}));

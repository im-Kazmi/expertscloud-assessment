"use client";
import { TaskForm } from "./task-form";
import { CreateTaskFormValues } from "@/app/lib/types";
import { useCreateTaskDialog } from "@/app/store/use-create-task-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { useCreateTask } from "@repo/features/task";

export function NewTaskDialog() {
  const { isOpen, onClose, projectId } = useCreateTaskDialog();

  const mutation = useCreateTask();

  const onSubmit = (data: CreateTaskFormValues) => {
    mutation.mutate(
      {
        ...data,
        projectId: projectId!,
      },
      {
        onSuccess: (data, vars) => {},
        onError: () => {},
        onSettled: () => {},
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="overflow-y-auto">
        <DialogContent className="max-h-[min(640px,80vh)] overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={onSubmit}
            onDelete={() => {}}
            disabled={mutation.isPending}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}

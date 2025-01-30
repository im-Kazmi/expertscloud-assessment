"use client";
import { TaskForm } from "./task-form";
import { CreateTaskFormValues } from "@/app/lib/types";
import { useCreateTaskDialog } from "@/app/store/use-create-task-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { useCreateTask } from "@repo/features/task";
import { QueryClient, useQueryClient } from "@repo/react-query";
import { useState } from "react";
import { AssigneesMultiSelector } from "./assignees-multi-select";
import { Button } from "@repo/design-system/components/ui/button";
import { TaskAssigneeForm } from "./task-assignee-form";

enum NewTaskDialogView {
  FORM = "FORM",
  ASSIGNEES = "ASSIGNEES",
}

export function NewTaskDialog() {
  const { isOpen, onClose, projectId } = useCreateTaskDialog();

  const [view, setView] = useState<NewTaskDialogView>(NewTaskDialogView.FORM);

  const queryClient = useQueryClient();
  const mutation = useCreateTask();

  const onSubmit = (data: CreateTaskFormValues) => {
    mutation.mutate(
      {
        ...data,
        projectId: projectId!,
      },
      {
        onSuccess: (data, vars) => {
          queryClient.invalidateQueries({
            queryKey: ["projects", { projectId }],
          });
          setView(NewTaskDialogView.ASSIGNEES);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="overflow-y-auto">
        <DialogContent className="max-h-[min(640px,80vh)] flex flex-col items-start w-full overflow-y-auto ">
          {view === NewTaskDialogView.FORM && (
            <>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <TaskForm
                onSubmit={onSubmit}
                onDelete={() => {}}
                disabled={mutation.isPending}
              />
            </>
          )}
          {view === NewTaskDialogView.ASSIGNEES && (
            <>
              <DialogHeader>
                <DialogTitle>Add Assignees</DialogTitle>
              </DialogHeader>
              <TaskAssigneeForm />
            </>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}

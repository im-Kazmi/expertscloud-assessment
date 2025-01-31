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
import { NewTaskDialogView } from "@/app/lib/types";

export function NewTaskDialog() {
  const { isOpen, onClose, projectId, setTaskId, taskId } =
    useCreateTaskDialog();

  const [view, setView] = useState<NewTaskDialogView>(NewTaskDialogView.FORM);

  const queryClient = useQueryClient();
  const createMutation = useCreateTask();

  const onSubmit = (data: CreateTaskFormValues) => {
    createMutation.mutate(
      {
        ...data,
        projectId: projectId!,
      },
      {
        onSuccess: (data, vars) => {
          queryClient.invalidateQueries({
            queryKey: ["projects", { id: projectId }],
          });
          setTaskId(data.id);
          setView(NewTaskDialogView.ASSIGNEES);
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        setView(NewTaskDialogView.FORM);
      }}
    >
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
                defaultValues={{
                  title: "",
                  description: "",
                  status: "TODO",
                  priority: "MEDIUM",
                  dueDate: "",
                  projectId: "",
                }}
                disabled={createMutation.isPending}
              />
            </>
          )}
          {view === NewTaskDialogView.ASSIGNEES && (
            <>
              <DialogHeader>
                <DialogTitle>Add Assignees</DialogTitle>
              </DialogHeader>
              <TaskAssigneeForm
                disabled={createMutation.isPending}
                setView={setView}
                taskId={taskId}
                onClose={onClose}
              />
            </>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}

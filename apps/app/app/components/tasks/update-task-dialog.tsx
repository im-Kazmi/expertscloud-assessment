"use client";
import { TaskForm } from "./task-form";
import { CreateTaskFormValues, UpdateTaskFormValues } from "@/app/lib/types";
import { useUpdateTaskDialog } from "@/app/store/use-update-task-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { useDeleteTask, useGetTaske, useUpdateTask } from "@repo/features/task";
import { QueryClient, useQueryClient } from "@repo/react-query";
import { useState } from "react";
import { AssigneesMultiSelector } from "./assignees-multi-select";
import { Button } from "@repo/design-system/components/ui/button";

export function UpdateTaksDialog() {
  const { isOpen, onClose, taskId } = useUpdateTaskDialog();

  const queryClient = useQueryClient();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask(taskId!);

  const { data, isLoading } = useGetTaske(taskId!);

  const onSubmit = (data: UpdateTaskFormValues) => {
    updateMutation.mutate(
      {
        ...data,
        id: taskId!,
      },
      {
        onSuccess: (data, vars) => {
          queryClient.refetchQueries();
          onClose();
        },
      },
    );
  };

  const isPending =
    updateMutation.isPending || deleteMutation.isPending || isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="overflow-y-auto">
        <DialogContent className="max-h-[min(640px,80vh)] flex flex-col items-start w-full overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={onSubmit}
            onDelete={() => {}}
            disabled={isPending}
            defaultValues={{
              status: data?.status,
              priority: data?.priority,
              projectId: data?.projectId!,
              title: data?.title!,
              description: data?.description!,
              dueDate: data?.dueDate!,
            }}
            id={data?.id ?? undefined}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}

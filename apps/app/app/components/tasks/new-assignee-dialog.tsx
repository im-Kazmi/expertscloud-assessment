"use client";
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
import { useCreateAssigneesDialog } from "@/app/store/use-create-assignees-dialog";
import { client } from "@repo/api/client";

export function NewAssigneeDialog() {
  const { isOpen, onClose, taskId } = useCreateAssigneesDialog();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
      }}
    >
      <div className="overflow-y-auto">
        <DialogContent className="max-h-[min(640px,80vh)] flex flex-col items-start w-full overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>Add Assignees</DialogTitle>
          </DialogHeader>
          <TaskAssigneeForm taskId={taskId} onClose={onClose} />
        </DialogContent>
      </div>
    </Dialog>
  );
}

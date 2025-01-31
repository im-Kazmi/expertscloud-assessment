"use client";

import { useOrganization } from "@repo/auth/client";
import { useState, useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MultipleSelector from "@repo/design-system/components/ui/multiselect";
import { assignUserSchema } from "@repo/types";
import { Button } from "@repo/design-system/components/ui/button";
import { AssigneesMultiSelector } from "./assignees-multi-select";
import { useCreateTaskDialog } from "@/app/store/use-create-task-dialog";
import { NewTaskDialogView } from "@/app/lib/types";
import { useAssignTask, useGetTaskAssignees } from "@repo/features/task";
import { useQueryClient } from "@repo/react-query";
import { DialogFooter } from "@repo/design-system/components/ui/dialog";

const schema = z.object({
  assignees: assignUserSchema,
});

type FormData = z.infer<typeof schema>;

type Props = {
  setView?: (view: NewTaskDialogView) => void;
  disabled?: boolean;
  taskId?: string;
  onClose?: () => void;
};

export function TaskAssigneeForm({
  setView,
  disabled = false,
  taskId,
  onClose,
}: Props) {
  const id = useId();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { assignees: [] },
  });

  const mutation = useAssignTask(taskId!);

  const { data: taskAssignees } = useGetTaskAssignees(taskId!);

  const onSubmit = (data: FormData) => {
    mutation.mutate(data.assignees, {
      onSuccess: () => {
        onClose?.();
        queryClient.refetchQueries();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 z-[100] w-full">
        <AssigneesMultiSelector
          onChange={(values) => setValue("assignees", values)}
          defaultValues={taskAssignees}
        />

        {errors.assignees && (
          <p className="text-red-500 text-sm">{errors.assignees.message}</p>
        )}
      </div>
      <DialogFooter className="">
        <Button disabled={mutation.isPending || disabled} type="submit">
          Submit
        </Button>
        <Button
          disabled={mutation.isPending || disabled}
          onClick={() => {
            onClose?.();
            setView?.(NewTaskDialogView.FORM);
          }}
        >
          cancel
        </Button>
      </DialogFooter>
    </form>
  );
}

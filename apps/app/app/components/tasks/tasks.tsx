"use client";

import { useState, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  useGetTasks,
  useUpdateTask,
  useUpdateTaskStatus,
} from "@repo/features/task";
import { useMutation, useQueryClient } from "@repo/react-query";
import { client } from "@repo/api/client";
import { TaskColumn } from "./task-column";
import { KanbanState } from "../../lib/types";
import { PlusCircle } from "lucide-react";
import { Button } from "@repo/design-system/components/ui/button";
import { Task } from "@prisma/client";
import { TaskWithDetails } from "../../lib/types";
import { useAuth, useUser } from "@repo/auth/client";
import { toast } from "sonner";

export function Tasks({
  tasks,
  projectId,
  isLoading,
}: {
  tasks: TaskWithDetails[];
  projectId: string;
  isLoading: boolean;
}) {
  const { user } = useUser();

  const { has } = useAuth();

  const [updatingId, setUpdatingId] = useState("");
  const queryClient = useQueryClient();

  const getColumnTasks = useMemo(
    () => (col: string) => tasks?.filter((t) => t.status === col),
    [tasks],
  );

  const taskAssignedToUser = useMemo(
    () =>
      tasks
        .filter((task) =>
          task.assignees.find((assignee) => assignee.user.clerkId === user?.id),
        )
        .map((t) => t.id),
    [tasks],
  );
  const updateMutation = useUpdateTaskStatus(projectId);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as Task["status"];
    setUpdatingId(newStatus);

    const isUserAssignedTask = taskAssignedToUser.includes(draggableId);

    if (!has) return;

    const havePermissions = has({ role: "org:admin" });

    if (!isUserAssignedTask && !havePermissions) {
      setUpdatingId("");
      return toast("I am really sorry!", {
        description:
          "Only the assignee and the manager can change the status of the task!",
        action: {
          label: "Apologize",
          onClick: () => console.log("Thank you."),
        },
      });
    }
    await updateMutation.mutateAsync(
      {
        id: draggableId,
        status: newStatus,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["tasks", { id: draggableId }],
          });
          setUpdatingId("");
        },
      },
    );
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="mx-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-auto">
            {["TODO", "IN_PROGRESS", "COMPLETED"].map((item, i) => (
              <TaskColumn
                key={i}
                column={{
                  id: item,
                  title: item[0] + item.slice(1).toLowerCase(),
                }}
                tasks={getColumnTasks(item) || []}
                disabled={updatingId === item}
                isLoading={isLoading}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

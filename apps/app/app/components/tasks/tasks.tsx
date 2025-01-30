"use client";

import { useState, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useGetTasks, useUpdateTask } from "@repo/features/task";
import { useMutation, useQueryClient } from "@repo/react-query";
import { client } from "@repo/api/client";
import { TaskColumn } from "./task-column";
// import { NewTaskDialog } from "./new-task-dialog";
import { KanbanState } from "../../lib/types";
import { PlusCircle } from "lucide-react";
import { Button } from "@repo/design-system/components/ui/button";
import { Task } from "@prisma/client";
import { TaskWithDateStrings } from "../../lib/types";

export function Tasks({
  tasks,
  projectId,
  isLoading,
}: {
  tasks: TaskWithDateStrings[];
  projectId: string;
  isLoading: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const queryClient = useQueryClient();

  const getColumnTasks = useMemo(
    () => (col: string) => tasks?.filter((t) => t.status === col),
    [tasks],
  );

  const updateMutation = useUpdateTask(projectId);

  const addTask = async (
    newTask: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => {
    //   await addTaskMutation.mutateAsync(newTask);
    //   setIsDialogOpen(false);
  };

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
    await updateMutation.mutateAsync(
      {
        id: draggableId,
        status: newStatus,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          setUpdatingId("");
        },
      },
    );
  };

  // if (isLoading) {
  //   return <div>Loading tasks...</div>;
  // }

  // if (error) {
  //   return <div>Error loading tasks: {error.message}</div>;
  // }

  return (
    <div className="p-8 min-h-screen">
      <div className="mx-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-auto">
            <TaskColumn
              column={{ id: "TODO", title: "Todo" }}
              tasks={getColumnTasks("TODO") || []}
              disabled={updatingId === "TODO"}
              isLoading={isLoading}
            />
            <TaskColumn
              disabled={updatingId === "IN_PROGRESS"}
              column={{ id: "IN_PROGRESS", title: "In progress" }}
              tasks={getColumnTasks("IN_PROGRESS") || []}
              isLoading={isLoading}
            />
            <TaskColumn
              column={{ id: "COMPLETED", title: "Completed" }}
              tasks={getColumnTasks("COMPLETED") || []}
              disabled={updatingId === "COMPLETED"}
              isLoading={isLoading}
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

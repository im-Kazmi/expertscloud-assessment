"use client";

import { useState, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useGetTasks, useUpdateTask } from "@repo/features/task";
import { useMutation, useQueryClient } from "@repo/react-query";
import { client } from "@repo/api/client";
import { TaskColumn } from "./task-column";
import { NewTaskDialog } from "./new-task-dialog";
import { KanbanState } from "../../lib/types";
import { PlusCircle } from "lucide-react";
import { Button } from "@repo/design-system/components/ui/button";
import { Task } from "@prisma/client";

export function Tasks() {
  const { data: tasks, isLoading, error } = useGetTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getColumnTasks = useMemo(
    () => (col: string) => tasks?.filter((t) => t.status === col),
    [tasks],
  );

  const updateMutation = useUpdateTask();

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
    await updateMutation.mutateAsync({
      id: draggableId,
      status: newStatus,
    });
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error loading tasks: {error.message}</div>;
  }

  return (
    <div className="p-8 min-h-screen">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-800">Manage Tasks</h1>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="mb-4 bg-teal-500 hover:bg-teal-600"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TaskColumn
              column={{ id: "TODO", title: "Todo" }}
              tasks={getColumnTasks("TODO") || []}
            />
            <TaskColumn
              column={{ id: "IN_PROGRESS", title: "In progress" }}
              tasks={getColumnTasks("IN_PROGRESS") || []}
            />
            <TaskColumn
              column={{ id: "COMPLETED", title: "Completed" }}
              tasks={getColumnTasks("COMPLETED") || []}
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

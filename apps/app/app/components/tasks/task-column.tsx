"use client";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskCard } from "./task-card";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { cn } from "@repo/design-system/lib/utils";
import type { Column } from "@/app/lib/types";
import { Loader } from "../shared/loader";
import type { TaskWithDetails } from "@/app/lib/types";
import { TaskCardSkeleton } from "../skeletons/task-card-skeleton";
import { useUser } from "@repo/auth/client";
import { useMemo } from "react";

type TaskColumnProps = {
  column: Column;
  tasks: TaskWithDetails[];
  disabled?: boolean;
  isLoading: boolean;
};

export function TaskColumn({
  column,
  tasks,
  disabled,
  isLoading,
}: TaskColumnProps) {
  const { user } = useUser();

  const taskAssignedToUser = useMemo(
    () =>
      tasks
        .filter((task: any) =>
          task.assignees.find(
            (assignee: any) => assignee.user.clerkId === user?.id,
          ),
        )
        .map((t) => t.id),
    [tasks],
  );

  return (
    <div
      className={cn(
        "bg-muted/50 p-6 border border-dashed relative flex flex-col h-fit rounded-lg ",
        disabled && "opacity-50 pointer-events-none",
      )}
    >
      {disabled && <Loader />}

      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        {column.title}
      </h2>
      <ScrollArea className="flex-grow">
        <Droppable droppableId={column.id}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-h-[200px]"
            >
              {!isLoading && tasks.length === 0 && (
                <div className="w-full h-40 rounded-lg shadow-sm bg-gray-50 border border-dashed flex items-center justify-center">
                  <div className="flex flex-col items-center gap-y-2 text-center">
                    <h1 className="text-lg font-semibold">No tasks</h1>
                    <p className="text-sm text-muted-foreground">
                      {column.id === "TODO" &&
                        "Start adding tasks to get things moving!"}
                      {column.id === "IN_PROGRESS" &&
                        "Pick a task and get started!"}
                      {column.id === "COMPLETED" &&
                        "Finish some tasks to see them here!"}
                    </p>
                  </div>
                </div>
              )}
              {isLoading &&
                Array(3)
                  .fill(0)
                  .map((_, index) => <TaskCardSkeleton key={index} />)}
              {!isLoading &&
                tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard
                          task={task as any}
                          taskAssignedToUser={taskAssignedToUser}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </ScrollArea>
    </div>
  );
}

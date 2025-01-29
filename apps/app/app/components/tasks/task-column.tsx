import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskCard } from "./task-card";
import { Column, TaskWithOrg } from "../../lib/types";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { Task, Prisma, Organization } from "@prisma/client";

interface TaskColumnProps {
  column: Column;
  tasks: TaskWithOrg[];
}

export function TaskColumn({ column, tasks }: TaskColumnProps) {
  return (
    <div className="bg-muted/50 p-6 border border-dashed">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        {column.title}
      </h2>
      <ScrollArea className="h">
        <Droppable droppableId={column.id}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.length === 0 && (
                <div className="w-full h-40 shadow-sm bg-muted/50 border border-dashed flex items-center justify-center">
                  <div className="flex flex-col items-center gap-y-2 text-center">
                    <h1 className="text-lg font-semibold">No tasks</h1>
                    <p className="text-sm text-muted-foreground">
                      {column.id === "TODO" &&
                        "Start adding tasks to get things moving!"}
                      {column.id === "IN_PROGRESS" &&
                        "Pick a task and get started!"}
                      {column.id === "DONE" &&
                        "Finish some tasks to see them here!"}
                    </p>
                  </div>
                </div>
              )}
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} />
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

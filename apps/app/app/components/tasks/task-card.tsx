import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { Calendar, Edit3, Flag, Trash, User } from "lucide-react";
import { format } from "date-fns";
import { TaskWithDetails } from "@/app/lib/types";
import { cn } from "@repo/design-system/lib/utils";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Priority } from "@prisma/client";
import { Button } from "@repo/design-system/components/ui/button";
import { useCreateAssigneesDialog } from "@/app/store/use-create-assignees-dialog";
import { useConfirm } from "@/app/hooks/use-confirm";
import { useDeleteTask } from "@repo/features/task";
import { useQueryClient } from "@repo/react-query";
import { useUpdateTaskDialog } from "@/app/store/use-update-task-dialog";

type TaskCardProps = {
  task: TaskWithDetails;
  taskAssignedToUser: string[];
};

export function TaskCard({ task, taskAssignedToUser }: TaskCardProps) {
  const queryClient = useQueryClient();

  const { onOpen } = useCreateAssigneesDialog();
  const { onOpen: OnOpenTaskUpdateDialog } = useUpdateTaskDialog();

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "This can't be undone.",
  });

  const deleteMutation = useDeleteTask(task.id!);

  const onEditClick = (e: React.FormEvent) => {
    e.stopPropagation();
    OnOpenTaskUpdateDialog(task.id);
  };

  const onAddAssigneeClick = (e: React.FormEvent) => {
    e.stopPropagation();
    onOpen(task.id);
  };

  const onDeleteClick = async (e: React.FormEvent) => {
    e.stopPropagation();
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          queryClient.refetchQueries();
        },
      });
    }
  };

  const isUserAssignedTask = taskAssignedToUser.includes(task.id);

  const PriorityColorMap: Record<Priority, string> = {
    LOW: "bg-green-200 text-green-800",
    MEDIUM: "bg-yellow-200 text-yellow-800",
    HIGH: "bg-orange-200 text-orange-800",
    CRITICAL: "bg-red-200 text-red-800",
  };

  return (
    <>
      <ConfirmationDialog />
      <Card
        className={cn(
          "bg-gray-50  rounded-lg  hover:bg-gray-100 transition-colors duration-200 border border-dashed shadow-sm my-3 ",
        )}
      >
        <CardContent className="p-4">
          <div className="flex justify-between w-full">
            <div className="text-lg font-medium text-gray-800 mb-2">
              {task.title}
            </div>
            {isUserAssignedTask && (
              <Badge variant={"outline"} className="size-fit shadow-none ">
                Your task
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              {task.description}
            </div>
            {task.dueDate && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(task.dueDate), "MMM dd, yyyy")}
              </div>
            )}
            <div className="flex items-center">
              <Flag className="mr-2 h-4 w-4" />
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${PriorityColorMap[task.priority]}`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        </CardContent>
        <div className="bg-neutral-300/20 min-h-10 z-50 border-t rounded-b-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700 flex gap-x-5 justify-between">
          <div className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
            {!task?.assignees.length && (
              <h1
                className="size-fit  hover:border-bottom cursor-pointer"
                onClick={onAddAssigneeClick}
              >
                Add Assignees
              </h1>
            )}
            {task?.assignees &&
              task?.assignees?.slice(0, 3).map((assignee) => (
                <Button
                  key={assignee?.user.clerkId}
                  variant={"secondary"}
                  size={"sm"}
                  className="size-fit"
                  onClick={onAddAssigneeClick}
                >
                  {assignee?.user.name}
                </Button>
              ))}
          </div>
          <div className="flex gap-x-2">
            <Button
              variant={"ghost"}
              onClick={onEditClick}
              size={"icon"}
              className=" cursor-pointer"
            >
              <Edit3 />
            </Button>
            <Button
              variant={"ghost"}
              onClick={onDeleteClick}
              size={"icon"}
              className=" cursor-pointer"
            >
              <Trash />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

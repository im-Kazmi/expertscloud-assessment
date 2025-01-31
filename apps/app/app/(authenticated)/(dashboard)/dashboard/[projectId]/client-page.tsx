"use client";
import { Tasks } from "@/app/components/tasks/tasks";
import { useGetProject } from "@repo/features/project";
import DashboardHeader from "@/app/components/dashboard/dashboard-header";
import { Button } from "@repo/design-system/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCreateTaskDialog } from "@/app/store/use-create-task-dialog";
import { Protect } from "@repo/auth/client";
import { useRouter } from "next/navigation";
import { TaskNotFound } from "@/app/components/not-found/task-not-found";

type Props = {
  id: string;
};

export function ClientPage({ id }: Props) {
  const { data: project, isLoading, error } = useGetProject(id);
  const { onOpen } = useCreateTaskDialog();

  const router = useRouter();

  if (!isLoading && !project) {
    return TaskNotFound();
  }

  return (
    <div>
      <DashboardHeader>
        <h1 className="text-xl font-bold text-gray-800">Manage Tasks</h1>
        <Protect condition={(has) => has({ role: "org:admin" })}>
          <Button onClick={() => onOpen(id)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </Protect>
      </DashboardHeader>
      <Tasks
        tasks={(project?.tasks as any) ?? []}
        projectId={id}
        isLoading={isLoading}
      />
    </div>
  );
}

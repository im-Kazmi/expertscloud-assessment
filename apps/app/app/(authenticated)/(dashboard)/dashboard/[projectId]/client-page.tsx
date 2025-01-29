"use client";
import { Tasks } from "@/app/components/tasks/tasks";
import { useGetProject } from "@repo/features/project";
import DashboardHeader from "@/app/components/dashboard/dashboard-header";
import { Button } from "@repo/design-system/components/ui/button";
import { PlusCircle } from "lucide-react";
type Props = {
  id: string;
};

export function ClientPage({ id }: Props) {
  const { data: project, isLoading, error } = useGetProject(id);
  return (
    <div>
      <DashboardHeader>
        <h1 className="text-xl font-bold text-gray-800">Manage Tasks</h1>
        <Button
          // onClick={() => setIsDialogOpen(true)}
          className="bg-teal-500 hover:bg-teal-600"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </DashboardHeader>
      <Tasks tasks={project?.tasks ?? []} projectId={id} />
    </div>
  );
}

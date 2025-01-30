"use client";
import { NewProjectButton } from "@/app/components/project/new-project-button";
import DashboardHeader from "@/app/components/dashboard/dashboard-header";
import { useGetProjects } from "@repo/features/project";
import { ProjectCard } from "@/app/components/project/project-card";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import ProjectCardSkeleton from "@/app/components/skeletons/project-card-skeleton";

export default function Page() {
  const { data: projects, isLoading } = useGetProjects();

  return (
    <div className="flex flex-col gap-y-5">
      <DashboardHeader>
        <h1 className="text-xl font-bold">Projects</h1>
        <NewProjectButton />
      </DashboardHeader>

      <div className="w-full  h-full min-h-[calc(100vh-200px)] p-5 rounded-lg">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 gap-5">
            {isLoading &&
              [...Array(6)].map((_, index) => (
                <ProjectCardSkeleton key={index} />
              ))}
            {!isLoading &&
              projects &&
              projects.map((project) => (
                <ProjectCard key={project.id} project={project as any} />
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

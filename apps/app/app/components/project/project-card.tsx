import { ProjectWithDetails } from "@/app/lib/types";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  project: ProjectWithDetails;
};

export const ProjectCard = ({ project }: Props) => {
  const completedTasksLength = useMemo(() => {
    return project.tasks.filter((p) => p.status === "COMPLETED").length;
  }, [project]);
  return (
    <Link
      href={`/dashboard/${project.id}`}
      className="flex flex-col bg-muted/20  border border-dashed shadow-sm hover:shadow-none cursor-pointer rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
    >
      <div className="p-4 md:p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {project.name}
        </h3>
        <p className="mt-2 text-gray-500 dark:text-neutral-400">
          {project.description}
        </p>
      </div>
      <div className="bg-muted border-t rounded-b-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700 flex gap-x-5">
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
          Total tasks: {project?.tasks && project.tasks?.length}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
          Completed tasks:{completedTasksLength}
        </p>
      </div>
    </Link>
  );
};

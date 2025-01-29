import { Organization, Project, Prisma } from "@prisma/client";

type Props = {
  project: Prisma.ProjectSelect;
};
export const ProjectCard = ({ project }: Props) => {
  return (
    <div className="flex flex-col bg-muted/20  border border-dashed shadow-sm hover:shadow-none cursor-pointer rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      <div className="p-4 md:p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {project.name}
        </h3>
        <p className="mt-2 text-gray-500 dark:text-neutral-400">
          {project.description}
        </p>
        <a
          className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-green-400 hover:underline"
          href="#"
        >
          Project link
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </a>
      </div>
      <div className="bg-muted border-t rounded-b-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700 flex gap-x-5">
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
          {/* Total tasks: {project?.tasks && project.tasks?.length} */}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
          {/* Completed tasks: {project?.tasks && project.tasks?.length} */}
        </p>
      </div>
    </div>
  );
};
